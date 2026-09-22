from rest_framework import serializers
from .models import Budget, Category, Transaction
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]
class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    signed_amount = serializers.SerializerMethodField()
    class Meta:
        model = Transaction
        fields = ["id", "type", "category", "category_name", "amount", "signed_amount", "description", "date", "created_at"]
        read_only_fields = ["id", "created_at"]
    def get_signed_amount(self, obj):
        return obj.amount if obj.type == Transaction.TxType.INCOME else -obj.amount
    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
class BudgetSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    spent = serializers.SerializerMethodField()
    over_budget = serializers.SerializerMethodField()
    class Meta:
        model = Budget
        fields = ["id", "category", "category_name", "month", "limit", "spent", "over_budget"]
        read_only_fields = ["id"]
    def get_spent(self, obj):
        transactions = Transaction.objects.filter(
            user=obj.user, category=obj.category, type=Transaction.TxType.EXPENSE,
            date__year=obj.month.year, date__month=obj.month.month,
        )
        return sum((transaction.amount for transaction in transactions), start=0)
    def get_over_budget(self, obj):
        return self.get_spent(obj) > obj.limit
    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)