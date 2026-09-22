from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
class Category(models.Model):
	name = models.CharField(max_length=60, unique=True)
	class Meta:
		ordering = ["name"]
		verbose_name_plural = "categories"
	def __str__(self):
		return self.name
class Transaction(models.Model):
	class TxType(models.TextChoices):
		INCOME = "income", "Income"
		EXPENSE = "expense", "Expense"
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="transactions")
	category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="transactions")
	type = models.CharField(max_length=7, choices=TxType.choices)
	amount = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0.01)])
	description = models.CharField(max_length=255, blank=True)
	date = models.DateField()
	created_at = models.DateTimeField(auto_now_add=True)
	class Meta:
		ordering = ["-date", "-created_at"]
class Budget(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="budgets")
	category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="budgets")
	month = models.DateField(help_text="Any day within the target month; day is ignored.")
	limit = models.DecimalField(max_digits=12, decimal_places=2, validators=[MinValueValidator(0)])
	class Meta:
		constraints = [
			models.UniqueConstraint(fields=["user", "category", "month"], name="unique_budget_per_month")
		]
