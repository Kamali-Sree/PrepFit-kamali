import pandas as pd

df = pd.DataFrame({
    "Region": ["North", "South", "East", "West"],
    "Product": ["Laptop", "Mobile", "Tablet", "Laptop"],
    "Year": [2023, 2023, 2024, 2024],
    "Sales": [250, 300, 280, 320]
})

print(df)

print(df[df["Year"] == 2024])                      # Slice
print(df[(df["Product"] == "Laptop")])             # Dice
print(df.groupby("Year")["Sales"].sum())           # Roll-up
print(df.groupby(["Year", "Region"])["Sales"].sum())  # Drill-down
print(pd.pivot_table(df, values="Sales",
                      index="Product", columns="Year"))  # Pivot
