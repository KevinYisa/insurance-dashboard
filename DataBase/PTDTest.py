"""
Synthetic Data Generator for Health Insurance Dataset
Uses both GaussianCopula and CTGAN to generate synthetic records,
then combines them with the original data.
All columns are kept; premium is re-enforced after generation.
Validation prints summary statistics and correlations.
Compatible with SDV 1.x
"""

import pandas as pd
import numpy as np

from sdv.single_table import GaussianCopulaSynthesizer
from sdv.single_table import CTGANSynthesizer
from sdv.metadata import SingleTableMetadata

# ----------------------------------------------------------------------
# CONFIGURATION – set your input file path here
INPUT_CSV = r"C:\Users\owner\Desktop\Health Insurance MLM\DataBase\SynthDataTraining\medical_insurance.csv"
OUTPUT_CSV = r"C:\Users\owner\Desktop\Health Insurance MLM\DataBase\SynthDataTraining\medical_insurance_expanded.csv"

# ----------------------------------------------------------------------
# Load data
def load_data(filepath):
    df = pd.read_csv(filepath)

    print(f"Loaded {len(df)} rows, {len(df.columns)} columns.")
    print("Column names:", df.columns.tolist())
    print("\nFirst 2 rows:\n", df.head(2))
    print("\nData types:\n", df.dtypes)
    print("\nMissing values:\n", df.isnull().sum())

    return df


# ----------------------------------------------------------------------
# Create SDV metadata
def create_metadata(df):
    metadata = SingleTableMetadata()
    metadata.detect_from_dataframe(data=df)
    return metadata


# ----------------------------------------------------------------------
# Train and generate for a given method
def generate_from_method(df, metadata, method, factor):
    """
    method: 'gaussian' or 'ctgan'
    factor: number of synthetic rows = len(df) * factor
    """

    if method == "gaussian":
        print("\nTraining GaussianCopula...")
        model = GaussianCopulaSynthesizer(metadata)

    elif method == "ctgan":
        print("\nTraining CTGAN (may take a minute)...")
        model = CTGANSynthesizer(
            metadata=metadata,
            epochs=100,
            batch_size=500,
            verbose=True,
        )

    else:
        raise ValueError("method must be 'gaussian' or 'ctgan'")

    model.fit(df)

    num_rows = int(len(df) * factor)

    synthetic = model.sample(num_rows=num_rows)

    # ------------------------------------------------------------------
    # Re-enforce premium relationship
    synthetic["premium"] = synthetic["expenses"] / 100

    return synthetic


# ----------------------------------------------------------------------
# Combine and shuffle
def combine_datasets(original, synthetic_gc, synthetic_ctgan):
    combined = pd.concat(
        [original, synthetic_gc, synthetic_ctgan],
        ignore_index=True,
    )

    combined = (
        combined.sample(frac=1, random_state=42)
        .reset_index(drop=True)
    )

    return combined


# ----------------------------------------------------------------------
# Validate
def validate(original, synthetic_gc, synthetic_ctgan, combined):

    print("\n" + "=" * 60)
    print("VALIDATION SUMMARY")
    print("=" * 60)

    num_cols = [
        "age",
        "bmi",
        "children",
        "expenses",
        "premium",
    ]

    cat_cols = [
        "gender",
        "discount_eligibility",
        "region",
    ]

    # Shapes
    print(f"\nOriginal shape: {original.shape}")
    print(f"Synthetic (GC) shape: {synthetic_gc.shape}")
    print(f"Synthetic (CTGAN) shape: {synthetic_ctgan.shape}")
    print(f"Combined shape: {combined.shape}")

    # Numerical summaries
    print("\n--- Numerical Summary (mean, std) ---")

    for name, df in [
        ("Original", original),
        ("GC", synthetic_gc),
        ("CTGAN", synthetic_ctgan),
    ]:

        print(f"\n{name}:")
        print(df[num_cols].describe().loc[["mean", "std"]])

    # Category proportions
    for col in cat_cols:

        print(f"\n--- {col} proportions ---")

        for name, df in [
            ("Original", original),
            ("GC", synthetic_gc),
            ("CTGAN", synthetic_ctgan),
        ]:

            print(f"\n{name}:")
            print(df[col].value_counts(normalize=True).sort_index())

    # Correlations
    print("\n--- Correlation matrix (Original) ---")
    print(original[num_cols].corr().round(3))

    print("\n--- Correlation matrix (GaussianCopula) ---")
    print(synthetic_gc[num_cols].corr().round(3))

    print("\n--- Correlation matrix (CTGAN) ---")
    print(synthetic_ctgan[num_cols].corr().round(3))

    # Premium relationship
    assert np.allclose(
        synthetic_gc["premium"] * 100,
        synthetic_gc["expenses"],
        rtol=1e-6,
    )

    assert np.allclose(
        synthetic_ctgan["premium"] * 100,
        synthetic_ctgan["expenses"],
        rtol=1e-6,
    )

    print("\n✓ Premium = expenses / 100 holds exactly.")

    # Value ranges
    print("\n--- Synthetic value ranges (GC) ---")

    for col in num_cols:
        print(
            f"{col}: "
            f"min={synthetic_gc[col].min():.2f}, "
            f"max={synthetic_gc[col].max():.2f}"
        )

    print("\n--- Synthetic value ranges (CTGAN) ---")

    for col in num_cols:
        print(
            f"{col}: "
            f"min={synthetic_ctgan[col].min():.2f}, "
            f"max={synthetic_ctgan[col].max():.2f}"
        )


# ----------------------------------------------------------------------
# Export
def export_dataset(df, filename):
    df.to_csv(filename, index=False)
    print(f"\nExpanded dataset saved to:\n{filename}")


# ----------------------------------------------------------------------
# Main pipeline
def main():

    # Load original data
    original = load_data(INPUT_CSV)

    # Detect metadata
    metadata = create_metadata(original)

    # GaussianCopula (~1.5x)
    gc_synth = generate_from_method(
        original,
        metadata,
        method="gaussian",
        factor=1.5,
    )

    print(f"Generated {len(gc_synth)} rows using GaussianCopula.")

    # CTGAN (~1.5x)
    ctgan_synth = generate_from_method(
        original,
        metadata,
        method="ctgan",
        factor=1.5,
    )

    print(f"Generated {len(ctgan_synth)} rows using CTGAN.")

    # Combine
    combined = combine_datasets(
        original,
        gc_synth,
        ctgan_synth,
    )

    print(f"\nCombined dataset size: {len(combined)} rows.")

    # Validate
    validate(
        original,
        gc_synth,
        ctgan_synth,
        combined,
    )

    # Export
    export_dataset(combined, OUTPUT_CSV)


if __name__ == "__main__":
    main()