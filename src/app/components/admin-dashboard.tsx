import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Search,
  Filter,
  Download,
  Edit,
  Users,
  CheckCircle,
  XCircle,
  Receipt,
  Award,
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount?: number;
  stampsEarned: number;
  invoiceNumber?: string;
  giftItem?: string;
}

interface Customer {
  id: string;
  fullName: string;
  contactNumber: string;
  birthday: string;
  gender: string;
  maritalStatus: string;
  email?: string;
  city?: string;
  dataConsent: boolean;
  marketingConsent: boolean;
  hearAbout: string;
  age: number;
  dateRegistered: string;
  loyaltyCardId: string;
  consentTimestamp: string;
  stamps: number;
  transactions: Transaction[];
  customerType?: string;
  hasPhysicalStore?: "Yes" | "No";
  storeName?: string;
  storeAddress?: string;
  tinNumber?: string;
  salesChannel?: string;
}

interface AdminDashboardProps {
  customers: Customer[];
  onUpdateCustomer: (id: string, updates: Partial<Customer>) => void;
  onAddTransaction: (customerId: string, transaction: Transaction) => void;
}

export function AdminDashboard({
  customers,
  onUpdateCustomer,
  onAddTransaction,
}: AdminDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<string>("all");
  const [filterMarital, setFilterMarital] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterOptIn, setFilterOptIn] = useState<string>("all");
  const [filterCustomerType, setFilterCustomerType] = useState<string>("all");
  const [ageRangeMin, setAgeRangeMin] = useState<string>("");
  const [ageRangeMax, setAgeRangeMax] = useState<string>("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [transactionCustomer, setTransactionCustomer] =
    useState<Customer | null>(null);
  const [showAddTransaction, setShowAddTransaction] = useState(false);

  // Sync transactionCustomer with updated customer data from props when customers change
  useEffect(() => {
    if (transactionCustomer) {
      const updated = customers.find((c) => c.id === transactionCustomer.id);
      if (updated && updated !== transactionCustomer) {
        // Only update if the customer data actually changed (stamps or transactions)
        const stampsChanged = updated.stamps !== transactionCustomer.stamps;
        const txCountChanged = updated.transactions.length !== transactionCustomer.transactions.length;
        if (stampsChanged || txCountChanged) {
          setTransactionCustomer(updated);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers]);

  const { register, handleSubmit, reset, setValue } = useForm();
  const {
    register: registerTx,
    handleSubmit: handleSubmitTx,
    reset: resetTx,
    formState: { errors: txErrors },
  } = useForm();

  // Get unique cities for filter dropdown
  const cities = useMemo(() => {
    const citySet = new Set<string>();
    customers.forEach((c) => {
      if (c.city) citySet.add(c.city);
    });
    return Array.from(citySet).sort();
  }, [customers]);

  // Filter and search customers
  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        customer.fullName.toLowerCase().includes(searchLower) ||
        customer.contactNumber.includes(searchTerm) ||
        customer.loyaltyCardId.toLowerCase().includes(searchLower);

      // Gender filter
      const matchesGender =
        filterGender === "all" || customer.gender === filterGender;

      // Marital status filter
      const matchesMarital =
        filterMarital === "all" || customer.maritalStatus === filterMarital;

      // City filter
      const matchesCity = filterCity === "all" || customer.city === filterCity;

      // Customer type filter
      const matchesCustomerType =
        filterCustomerType === "all" ||
        (filterCustomerType === "Customer" &&
          (customer.customerType ?? "Customer") === "Customer") ||
        (filterCustomerType === "Reseller" &&
          (customer.customerType ?? "Customer") === "Reseller");

      // Marketing opt-in filter
      const matchesOptIn =
        filterOptIn === "all" ||
        (filterOptIn === "opted-in" && customer.marketingConsent) ||
        (filterOptIn === "opted-out" && !customer.marketingConsent);

      // Age range filter
      const matchesAgeMin =
        !ageRangeMin || customer.age >= parseInt(ageRangeMin);
      const matchesAgeMax =
        !ageRangeMax || customer.age <= parseInt(ageRangeMax);

      return (
        matchesSearch &&
        matchesGender &&
        matchesMarital &&
        matchesCity &&
        matchesCustomerType &&
        matchesOptIn &&
        matchesAgeMin &&
        matchesAgeMax
      );
    });
  }, [
    customers,
    searchTerm,
    filterGender,
    filterMarital,
    filterCity,
    filterCustomerType,
    filterOptIn,
    ageRangeMin,
    ageRangeMax,
  ]);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "Loyalty Card ID",
      "Full Name",
      "Contact Number",
      "Email",
      "Birthday",
      "Age",
      "Gender",
      "Marital Status",
      "City",
      "Customer Type",
      "Has Physical Store",
      "Store Name",
      "Store Address",
      "TIN Number",
      "Sales Channel",
      "Marketing Opt-In",
      "How Heard About Us",
      "Date Registered",
      "Consent Timestamp",
    ];

    const rows = filteredCustomers.map((customer) => [
      customer.loyaltyCardId,
      customer.fullName,
      customer.contactNumber,
      customer.email || "",
      customer.birthday,
      customer.age,
      customer.gender,
      customer.maritalStatus,
      customer.city || "",
      customer.customerType ?? "Customer",
      customer.hasPhysicalStore ?? "No",
      customer.storeName ?? "",
      customer.storeAddress ?? "",
      customer.tinNumber ?? "",
      customer.salesChannel ?? "",
      customer.marketingConsent ? "Yes" : "No",
      customer.hearAbout,
      new Date(customer.dateRegistered).toLocaleString(),
      new Date(customer.consentTimestamp).toLocaleString(),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `gmax-loyalty-customers-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Normalize date to YYYY-MM-DD for <input type="date">
  const toDateOnly = (dateStr: string | undefined) => {
    if (!dateStr) return "";
    const s = String(dateStr);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    return s.slice(0, 10);
  };

  // Handle edit customer
  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    reset({
      fullName: customer.fullName,
      contactNumber: customer.contactNumber,
      email: customer.email ?? "",
      birthday: toDateOnly(customer.birthday),
      gender: customer.gender,
      maritalStatus: customer.maritalStatus,
      city: customer.city ?? "",
    });
  };

  const onEditSubmit = (data: any) => {
    if (editingCustomer) {
      // Calculate age if birthday changed
      const age = calculateAge(data.birthday);
      onUpdateCustomer(editingCustomer.id, {
        ...data,
        age,
      });
      setEditingCustomer(null);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    return age;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterGender("all");
    setFilterMarital("all");
    setFilterCity("all");
    setFilterOptIn("all");
    setAgeRangeMin("");
    setAgeRangeMax("");
  };

  const activeFiltersCount = [
    filterGender !== "all",
    filterMarital !== "all",
    filterCity !== "all",
    filterOptIn !== "all",
    ageRangeMin !== "",
    ageRangeMax !== "",
  ].filter(Boolean).length;

  const handleAddTransaction = (customer: Customer) => {
    setTransactionCustomer(customer);
    setShowAddTransaction(true);
  };

  const onAddTransactionSubmit = async (data: any) => {
    if (!transactionCustomer) return;
    
    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: data.date,
      description: data.description,
      amount: data.amount ? parseFloat(data.amount) : undefined,
      stampsEarned: parseInt(data.stampsEarned),
      invoiceNumber: data.invoiceNumber || undefined,
      giftItem: data.giftItem || undefined,
    };

    try {
      await onAddTransaction(transactionCustomer.id, transaction);
      resetTx();
      setShowAddTransaction(false);
    } catch (err) {
      console.error('Failed to submit transaction:', err);
    }
  };

  return (
    <div className="w-full p-4 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Customers</CardDescription>
            <CardTitle className="text-3xl">{customers.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              Registered members
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Marketing Opt-Ins</CardDescription>
            <CardTitle className="text-3xl">
              {customers.filter((c) => c.marketingConsent).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 mr-2" />
              {customers.length > 0
                ? Math.round(
                    (customers.filter((c) => c.marketingConsent).length /
                      customers.length) *
                      100,
                  )
                : 0}{" "}
              % of total
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Filtered Results</CardDescription>
            <CardTitle className="text-3xl">
              {filteredCustomers.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-sm text-gray-600">
              <Filter className="h-4 w-4 mr-2" />
              Currently displayed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Actions Bar */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, contact, or loyalty card ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="relative"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center"
                  >
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
              <Button
                onClick={exportToCSV}
                disabled={filteredCustomers.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Filters Panel */}
        {showFilters && (
          <CardContent className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select value={filterGender} onValueChange={setFilterGender}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                    <SelectItem value="Prefer not to say">
                      Prefer not to say
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Customer Type</Label>
                <Select
                  value={filterCustomerType}
                  onValueChange={setFilterCustomerType}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Reseller">Reseller</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Marital Status</Label>
                <Select value={filterMarital} onValueChange={setFilterMarital}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Single">Single</SelectItem>
                    <SelectItem value="Married">Married</SelectItem>
                    <SelectItem value="Married with Kids">
                      Married with Kids
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>City</Label>
                <Select value={filterCity} onValueChange={setFilterCity}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Cities</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Marketing Opt-In</Label>
                <Select value={filterOptIn} onValueChange={setFilterOptIn}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="opted-in">Opted In</SelectItem>
                    <SelectItem value="opted-out">Opted Out</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Age Range (Min)</Label>
                <Input
                  type="number"
                  placeholder="Min age"
                  value={ageRangeMin}
                  onChange={(e) => setAgeRangeMin(e.target.value)}
                  min="0"
                  max="120"
                />
              </div>

              <div className="space-y-2">
                <Label>Age Range (Max)</Label>
                <Input
                  type="number"
                  placeholder="Max age"
                  value={ageRangeMax}
                  onChange={(e) => setAgeRangeMax(e.target.value)}
                  min="0"
                  max="120"
                />
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <Button variant="ghost" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </CardContent>
        )}
      </Card>

      {/* Customer Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loyalty Card ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Stamps</TableHead>
                  <TableHead>Marketing</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-8 text-gray-500"
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-mono text-sm">
                        {customer.loyaltyCardId}
                      </TableCell>
                      <TableCell className="font-medium">
                        {customer.fullName}
                      </TableCell>
                      <TableCell>{customer.contactNumber}</TableCell>
                      <TableCell>{customer.email || "-"}</TableCell>
                      <TableCell>{customer.age}</TableCell>
                      <TableCell>
                        <Badge
                          variant="default"
                          className="bg-amber-500 hover:bg-amber-600"
                        >
                          <Award className="h-3 w-3 mr-1" />
                          {customer.stamps || 0}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {customer.marketingConsent ? (
                          <Badge variant="default" className="bg-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="secondary">
                            <XCircle className="h-3 w-3 mr-1" />
                            No
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {new Date(customer.dateRegistered).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(customer)}
                            title="Edit Customer"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setTransactionCustomer(customer);
                              setShowAddTransaction(false);
                            }}
                            title="View Transactions"
                          >
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog
        open={!!editingCustomer}
        onOpenChange={() => setEditingCustomer(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Customer Details</DialogTitle>
            <DialogDescription>
              Update customer information. Consent history cannot be modified.
            </DialogDescription>
          </DialogHeader>
          {editingCustomer && (
            <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input {...register("fullName")} />
                </div>
                <div className="space-y-2">
                  <Label>Contact Number</Label>
                  <Input {...register("contactNumber")} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input {...register("email")} type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Birthday</Label>
                  <Input {...register("birthday")} type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    defaultValue={editingCustomer.gender}
                    onValueChange={(value) => setValue("gender", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register("gender")} />
                </div>
                <div className="space-y-2">
                  <Label>Marital Status</Label>
                  <Select
                    defaultValue={editingCustomer.maritalStatus}
                    onValueChange={(value) => setValue("maritalStatus", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Married with Kids">
                        Married with Kids
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <input type="hidden" {...register("maritalStatus")} />
                </div>
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input {...register("city")} />
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">
                  Consent Information (Read-Only)
                </p>
                <div className="text-sm space-y-1">
                  <p>
                    Data Consent:{" "}
                    <Badge>{editingCustomer.dataConsent ? "Yes" : "No"}</Badge>
                  </p>
                  <p>
                    Marketing Consent:{" "}
                    <Badge>
                      {editingCustomer.marketingConsent ? "Yes" : "No"}
                    </Badge>
                  </p>
                  <p className="text-gray-600">
                    Consent Timestamp:{" "}
                    {new Date(
                      editingCustomer.consentTimestamp,
                    ).toLocaleString()}
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingCustomer(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Transaction Dialog */}
      <Dialog
        open={showAddTransaction}
        onOpenChange={() => setShowAddTransaction(false)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Record a new transaction when customer presents their loyalty
              card.
            </DialogDescription>
          </DialogHeader>
          {transactionCustomer && (
            <form
              onSubmit={handleSubmitTx(onAddTransactionSubmit)}
              className="space-y-4"
            >
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">
                      {transactionCustomer.fullName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transactionCustomer.loyaltyCardId}
                    </p>
                  </div>
                  <Badge
                    variant="default"
                    className="bg-amber-500 hover:bg-amber-600 text-lg px-3 py-1"
                  >
                    <Award className="h-4 w-4 mr-1" />
                    {transactionCustomer.stamps} stamps
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    Transaction Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...registerTx("date", { required: true })}
                    type="datetime-local"
                    defaultValue={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Stamps to Add <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...registerTx("stampsEarned", { required: true, min: 1 })}
                    type="number"
                    min="1"
                    defaultValue="1"
                    placeholder="e.g., 1"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    {...registerTx("description", { required: true })}
                    placeholder="Item Purchased"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label>
                    Gift Item / SKU{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    {...registerTx("giftItem")}
                    placeholder="e.g., Free Mug, SKU-1234"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Amount (PHP){" "}
                    <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    {...registerTx("amount")}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 500.00"
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    Sales Invoice Number{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </Label>
                  <Input
                    {...registerTx("invoiceNumber")}
                    placeholder="e.g., INV-2024-001"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddTransaction(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Record Transaction</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* View Transactions Dialog */}
      <Dialog
        open={!!transactionCustomer && !showAddTransaction}
        onOpenChange={() => setTransactionCustomer(null)}
      >
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              View and manage customer loyalty card transactions
            </DialogDescription>
          </DialogHeader>
          {transactionCustomer && (
            <div className="space-y-4">
              {/* Customer Info Header */}
              <Card className="border-2">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {transactionCustomer.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {transactionCustomer.contactNumber}
                      </p>
                      <p className="text-sm text-gray-600 font-mono">
                        {transactionCustomer.loyaltyCardId}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant="default"
                        className="bg-amber-500 hover:bg-amber-600 text-xl px-4 py-2"
                      >
                        <Award className="h-5 w-5 mr-2" />
                        {transactionCustomer.stamps || 0} stamps
                      </Badge>
                      <p className="text-xs text-gray-600 mt-2">
                        {(transactionCustomer.transactions || []).length}{" "}
                        transaction(s)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add Transaction Button */}
              <Button
                onClick={() => setShowAddTransaction(true)}
                className="w-full"
                size="lg"
              >
                <Receipt className="h-4 w-4 mr-2" />
                Record New Transaction
              </Button>

              {/* Transaction List */}
              {(transactionCustomer.transactions ?? []).length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No transactions yet</p>
                  <p className="text-sm">
                    Click the button above to record the first transaction
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">
                    Transaction History
                  </h4>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {[...(transactionCustomer.transactions ?? [])]
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )
                      .map((transaction) => (
                        <Card key={transaction.id}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge
                                    variant="default"
                                    className="bg-amber-500"
                                  >
                                    +{transaction.stampsEarned} stamps
                                  </Badge>
                                  {(() => {
                                    const raw = (transaction as any).amount;
                                    const amount =
                                      typeof raw === "number"
                                        ? raw
                                        : raw != null
                                          ? Number(raw)
                                          : null;
                                    return Number.isFinite(amount) ? (
                                      <span className="text-sm text-gray-600">
                                        ₱{(amount as number).toFixed(2)}
                                      </span>
                                    ) : null;
                                  })()}
                                </div>
                                <p className="font-medium">
                                  {transaction.description}
                                </p>
                                {transaction.giftItem && (
                                  <p className="text-sm text-purple-700 font-medium">
                                    Gift item: {transaction.giftItem}
                                  </p>
                                )}
                                {transaction.invoiceNumber && (
                                  <p className="text-sm text-gray-500 font-mono">
                                    Invoice: {transaction.invoiceNumber}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600">
                                  {new Date(
                                    transaction.date,
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setTransactionCustomer(null)}
                >
                  Close
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
