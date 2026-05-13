from typing import Dict, List
from decimal import Decimal


class FinancialCalculations:
    """
    Handles all financial calculations for SACS and TCC reports.
    """

    @staticmethod
    def calculate_sacs_excess(monthly_salary: float, expense_budget: float) -> Dict[str, float]:
        """
        Calculate Private Reserve Excess for SACS.
        
        Formula: Inflow - Outflow = Excess
        
        Args:
            monthly_salary: Monthly salary/deposits
            expense_budget: Monthly expense budget
            
        Returns:
            Dict with inflow, outflow, and excess
        """
        inflow = float(monthly_salary)
        outflow = float(expense_budget)
        excess = inflow - outflow

        return {
            "inflow": inflow,
            "outflow": outflow,
            "excess": excess,
        }

    @staticmethod
    def calculate_tcc_totals(account_values: Dict[str, List[float]]) -> Dict[str, float]:
        """
        Calculate TCC totals by account category.
        
        Args:
            account_values: Dict with account types as keys and lists of values
            Example: {
                "retirement": [50000, 75000, 100000],
                "non_retirement": [200000, 150000],
                "trust": [500000],
                "liabilities": [-300000, -50000]
            }
            
        Returns:
            Dict with category totals and net worth
        """
        retirement_total = sum(account_values.get("retirement", []))
        non_retirement_total = sum(account_values.get("non_retirement", []))
        trust_total = sum(account_values.get("trust", []))
        liabilities_total = sum(account_values.get("liabilities", []))

        total_assets = retirement_total + non_retirement_total + trust_total
        net_worth = total_assets + liabilities_total  # liabilities are negative

        return {
            "retirement_total": float(retirement_total),
            "non_retirement_total": float(non_retirement_total),
            "trust_total": float(trust_total),
            "liabilities_total": float(liabilities_total),
            "total_assets": float(total_assets),
            "net_worth": float(net_worth),
        }

    @staticmethod
    def calculate_age(birth_date) -> int:
        """
        Calculate client age from birth date.
        
        Args:
            birth_date: datetime.date object
            
        Returns:
            Age in years
        """
        from datetime import date
        today = date.today()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        return age

    @staticmethod
    def validate_financial_data(data: Dict) -> tuple[bool, List[str]]:
        """
        Validate financial data for errors.
        
        Args:
            data: Financial data to validate
            
        Returns:
            Tuple of (is_valid, error_messages)
        """
        errors = []

        if "monthly_salary" in data and data["monthly_salary"] < 0:
            errors.append("Monthly salary cannot be negative")

        if "expense_budget" in data and data["expense_budget"] < 0:
            errors.append("Expense budget cannot be negative")

        if "reserve_target" in data and data["reserve_target"] < 0:
            errors.append("Reserve target cannot be negative")

        if "monthly_salary" in data and "expense_budget" in data:
            if data["expense_budget"] > data["monthly_salary"] * 2:
                errors.append("Expense budget seems unreasonably high compared to salary")

        return len(errors) == 0, errors
