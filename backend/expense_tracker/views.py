from django.db.models import Sum
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Budget, Category, Transaction
from .serializers import BudgetSerializer, CategorySerializer, TransactionSerializer
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = Category.objects.all()
	serializer_class = CategorySerializer
	permission_classes = [permissions.IsAuthenticated]
class TransactionViewSet(viewsets.ModelViewSet):
	serializer_class = TransactionSerializer
	permission_classes = [permissions.IsAuthenticated]
	def get_queryset(self):
		queryset = Transaction.objects.filter(user=self.request.user).select_related("category")
		params = self.request.query_params
		if params.get("category"):
			queryset = queryset.filter(category_id=params["category"])
		if params.get("type") in ("income", "expense"):
			queryset = queryset.filter(type=params["type"])
		if params.get("date_from"):
			queryset = queryset.filter(date__gte=params["date_from"])
		if params.get("date_to"):
			queryset = queryset.filter(date__lte=params["date_to"])
		return queryset
	@action(detail=False, methods=["get"])
	def summary(self, request):
		queryset = self.get_queryset()
		income = queryset.filter(type=Transaction.TxType.INCOME).aggregate(total=Sum("amount"))["total"] or 0
		expense = queryset.filter(type=Transaction.TxType.EXPENSE).aggregate(total=Sum("amount"))["total"] or 0
		categories = queryset.filter(type=Transaction.TxType.EXPENSE).values(
			"category__id", "category__name"
		).annotate(total=Sum("amount")).order_by("-total")
		return Response({
			"income_total": income,
			"expense_total": expense,
			"balance": income - expense,
			"by_category": [
				{"category_id": item["category__id"], "category": item["category__name"], "total": item["total"]}
				for item in categories
			],
		})
class BudgetViewSet(viewsets.ModelViewSet):
	serializer_class = BudgetSerializer
	permission_classes = [permissions.IsAuthenticated]
	def get_queryset(self):
		queryset = Budget.objects.filter(user=self.request.user).select_related("category")
		month = self.request.query_params.get("month")
		if month:
			queryset = queryset.filter(month__year=month[:4], month__month=month[5:7])
		return queryset
