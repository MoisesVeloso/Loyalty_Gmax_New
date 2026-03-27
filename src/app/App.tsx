import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { RegistrationForm } from './components/registration-form';
import { AdminDashboard } from './components/admin-dashboard';
import { UserPlus, LayoutDashboard } from 'lucide-react';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

export interface Transaction {
  id: string; // backend IDs are strings
  date: string;
  description: string;
  amount?: number;
  stampsEarned: number;
  invoiceNumber?: string;
  giftItem?: string;
}

export interface Customer {
  id: string; // backend IDs like "LC1"
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
  hasPhysicalStore?: 'Yes' | 'No';
  storeName?: string;
  storeAddress?: string;
  tinNumber?: string;
  salesChannel?: string;
}

export default function App() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeTab, setActiveTab] = useState('registration');

  // ----------------- Load customers from backend -----------------
  // Backend returns camelCase; support both for compatibility
  useEffect(() => {
    fetch('http://localhost:3000/customers')
      .then(res => res.json())
      .then((data: any[]) => {
        const normalized = data.map((c: any) => ({
          id: String(c.id),
          fullName: c.fullName ?? c.full_name ?? '',
          contactNumber: c.contactNumber ?? c.contact_number ?? '',
          birthday: c.birthday ?? '',
          gender: c.gender ?? '',
          maritalStatus: c.maritalStatus ?? c.marital_status ?? '',
          email: c.email ?? '',
          city: c.city ?? '',
          dataConsent: c.dataConsent ?? c.data_consent ?? false,
          marketingConsent: c.marketingConsent ?? c.marketing_consent ?? false,
          hearAbout: c.hearAbout ?? c.hear_about ?? '',
          age: c.age ?? (c.birthday ? new Date().getFullYear() - new Date(c.birthday).getFullYear() : 0),
          dateRegistered: c.dateRegistered ?? c.date_registered ?? '',
          loyaltyCardId: c.loyaltyCardId ?? c.loyalty_card_id ?? String(c.id),
          consentTimestamp: c.consentTimestamp ?? c.consent_timestamp ?? '',
          stamps: c.stamps ?? 0,
          customerType: c.customerType ?? c.cust_type ?? 'Customer',
          hasPhysicalStore: c.hasPhysicalStore ?? (c.has_physical_store ? 'Yes' : 'No'),
          storeName: c.storeName ?? c.store_name ?? '',
          storeAddress: c.storeAddress ?? c.store_address ?? '',
          tinNumber: c.tinNumber ?? c.tin_number ?? '',
          salesChannel: c.salesChannel ?? c.sales_channel ?? '',
          transactions: (c.transactions ?? []).map((t: any) => ({
            id: String(t.id),
            date: t.date,
            description: t.description,
            amount: t.amount,
            stampsEarned: t.stampsEarned ?? t.stamps_earned ?? 0,
            invoiceNumber: t.invoiceNumber ?? t.invoice_number ?? undefined,
            giftItem: t.giftItem ?? t.gift_item ?? undefined,
          })),
        }));
        setCustomers(normalized);
      })
      .catch(err => {
        console.error(err);
        toast.error('Failed to load customers');
      });
  }, []);


  // ----------------- Add customer (form already POSTed; we add backend response to state) -----------------
  const handleAddCustomer = (savedCustomer: any) => {
    const n = savedCustomer;
    const normalized: Customer = {
      id: String(n.id),
      fullName: n.fullName ?? n.full_name ?? '',
      contactNumber: n.contactNumber ?? n.contact_number ?? '',
      birthday: n.birthday ?? '',
      gender: n.gender ?? '',
      maritalStatus: n.maritalStatus ?? n.marital_status ?? '',
      email: n.email ?? '',
      city: n.city ?? '',
      dataConsent: n.dataConsent ?? n.data_consent ?? false,
      marketingConsent: n.marketingConsent ?? n.marketing_consent ?? false,
      hearAbout: n.hearAbout ?? n.hear_about ?? '',
      age: n.age ?? (n.birthday ? new Date().getFullYear() - new Date(n.birthday).getFullYear() : 0),
      dateRegistered: n.dateRegistered ?? n.date_registered ?? '',
      loyaltyCardId: n.loyaltyCardId ?? n.loyalty_card_id ?? String(n.id),
      consentTimestamp: n.consentTimestamp ?? n.consent_timestamp ?? '',
      stamps: n.stamps ?? 0,
      customerType: n.customerType ?? n.cust_type ?? 'Customer',
      hasPhysicalStore: n.hasPhysicalStore ?? (n.has_physical_store ? 'Yes' : 'No'),
      storeName: n.storeName ?? n.store_name ?? '',
      storeAddress: n.storeAddress ?? n.store_address ?? '',
      tinNumber: n.tinNumber ?? n.tin_number ?? '',
      salesChannel: n.salesChannel ?? n.sales_channel ?? '',
      transactions: [],
    };
    setCustomers((prev) => [normalized, ...prev]);
    toast.success('Customer registered successfully!', {
      description: `Loyalty Card ID: ${normalized.loyaltyCardId}`,
    });
    setTimeout(() => setActiveTab('dashboard'), 2000);
  };

  // ----------------- Update customer -----------------
  const handleUpdateCustomer = async (id: string, updates: Partial<Customer>) => {
    try {
      const res = await fetch(`http://localhost:3000/customers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const u = await res.json();
      if (!res.ok) throw new Error(u.error || 'Update failed');

      const existing = customers.find((c) => c.id === id);
      const normalized: Customer = {
        id: String(u.id),
        fullName: u.fullName ?? u.full_name ?? '',
        contactNumber: u.contactNumber ?? u.contact_number ?? '',
        birthday: u.birthday ?? '',
        gender: u.gender ?? '',
        maritalStatus: u.maritalStatus ?? u.marital_status ?? '',
        email: u.email ?? '',
        city: u.city ?? '',
        dataConsent: u.dataConsent ?? u.data_consent ?? false,
        marketingConsent: u.marketingConsent ?? u.marketing_consent ?? false,
        hearAbout: u.hearAbout ?? u.hear_about ?? '',
        age: u.age ?? 0,
        dateRegistered: u.dateRegistered ?? u.date_registered ?? '',
        loyaltyCardId: u.loyaltyCardId ?? u.loyalty_card_id ?? String(u.id),
        consentTimestamp: u.consentTimestamp ?? u.consent_timestamp ?? '',
        stamps: u.stamps ?? 0,
        customerType: u.customerType ?? u.cust_type ?? existing?.customerType ?? 'Customer',
        hasPhysicalStore:
          u.hasPhysicalStore ??
          (u.has_physical_store ? 'Yes' : existing?.hasPhysicalStore ?? 'No'),
        storeName: u.storeName ?? u.store_name ?? existing?.storeName ?? '',
        storeAddress: u.storeAddress ?? u.store_address ?? existing?.storeAddress ?? '',
        tinNumber: u.tinNumber ?? u.tin_number ?? existing?.tinNumber ?? '',
        salesChannel: u.salesChannel ?? u.sales_channel ?? existing?.salesChannel ?? '',
        transactions: existing?.transactions ?? [],
      };

      setCustomers((prev) => prev.map((c) => (c.id === id ? normalized : c)));
      toast.success('Customer details updated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to update customer');
    }
  };

  // ----------------- Add transaction -----------------
  const handleAddTransaction = async (customerId: string, transaction: Transaction) => {
    try {
      const res = await fetch(`http://localhost:3000/customers/${customerId}/transactions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      const savedTransaction = await res.json();
      if (!res.ok) throw new Error(savedTransaction.error || 'Failed to add transaction');

      const stampsEarned = savedTransaction.stampsEarned ?? savedTransaction.stamps_earned ?? transaction.stampsEarned ?? 0;
      const transactionId = savedTransaction.id ? String(savedTransaction.id) : String(Date.now());

      setCustomers(prev =>
        prev.map(c =>
          c.id === customerId
            ? { 
                ...c,
                stamps: (c.stamps || 0) + stampsEarned,
                transactions: [...(c.transactions || []), {
                  id: transactionId,
                  date: savedTransaction.date ?? transaction.date,
                  description: savedTransaction.description ?? transaction.description,
                  amount: savedTransaction.amount ?? transaction.amount,
                  stampsEarned,
                  invoiceNumber: savedTransaction.invoiceNumber ?? savedTransaction.invoice_number ?? transaction.invoiceNumber,
                  giftItem: savedTransaction.giftItem ?? savedTransaction.gift_item ?? transaction.giftItem,
                }],
              }
            : c
        )
      );
      toast.success('Transaction recorded!', {
        description: `${stampsEarned} stamp(s) added`,
      });
    } catch (err) {
      console.error('Transaction error:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to add transaction');
    }
  };

  const existingContacts = customers.map(c => c.contactNumber);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">GMAX Loyalty Program</h1>
            <p className="text-sm text-gray-600">Customer Management System</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              Total Members: <span className="font-semibold text-gray-900">{customers.length}</span>
            </p>
            <p className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-6">
            <TabsTrigger value="registration" className="flex items-center gap-2">
              <UserPlus className="h-4 w-4" /> Registration
            </TabsTrigger>
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="registration" className="mt-0">
            <RegistrationForm
              onSubmit={handleAddCustomer}
              existingContacts={existingContacts}
            />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <AdminDashboard
              customers={customers}
              onUpdateCustomer={handleUpdateCustomer}
              onAddTransaction={handleAddTransaction}
            />
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            For full program details and privacy notice, visit:{' '}
            <a
              href="https://go.astron.com.ph/gmaxloyaltyprogram"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              go.astron.com.ph/gmaxloyaltyprogram
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
