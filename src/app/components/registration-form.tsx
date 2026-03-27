import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { CheckCircle2 } from 'lucide-react';

/* ================= TYPES ================= */

interface RegistrationFormData {
  fullName: string;
  contactNumber: string;
  birthday: string;
  gender: string;
  maritalStatus: string;
  email?: string;
  city?: string;
  hearAbout: string;
  customerType: 'Customer' | 'Reseller';
  hasPhysicalStore?: 'Yes' | 'No';
  storeName?: string;
  storeAddress?: string;
  tinNumber?: string;
  salesChannel?: string;
}

interface Customer extends RegistrationFormData {
  id: number;
  age: number;
  dateRegistered: string;
  consentTimestamp: string;
  stamps: number;
  transactions: any[];
  dataConsent: boolean;
  marketingConsent: boolean;
}

interface RegistrationFormProps {
  onSubmit: (customer: Customer) => void;
  existingContacts: string[];
}

/* ================= COMPONENT ================= */

export function RegistrationForm({
  onSubmit,
  existingContacts,
}: RegistrationFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<RegistrationFormData>();

  const birthday = watch('birthday');
  const customerType = watch('customerType');
  const hasPhysicalStore = watch('hasPhysicalStore');

  /* ================= HELPERS ================= */

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

  const validateContactNumber = (value: string) => {
    if (!/^\d+$/.test(value)) {
      return 'Contact number must contain only digits';
    }
    if (value.length < 10 || value.length > 15) {
      return 'Contact number must be between 11 digits only';
    }
    if (existingContacts.includes(value)) {
      return 'This contact number is already registered';
    }
    return true;
  };

  const validateEmail = (value?: string) => {
    if (!value) return true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) || 'Please enter a valid email address';
  };

  /* ================= SUBMIT (BACKEND LOGIC ONLY) ================= */

  const onFormSubmit = async (data: RegistrationFormData) => {
    if (!dataConsent) return;

    const payload = {
      ...data,
      age: calculateAge(data.birthday),
      dataConsent,
      marketingConsent,
    };

    try {
      const response = await fetch('http://localhost:3000/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error((data && data.error) || 'Registration failed');
      }

      onSubmit(data);

      setShowSuccess(true);
      reset();
      setDataConsent(false);
      setMarketingConsent(false);

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      console.error(error);
      alert('Registration failed. Please try again.');
    }
  };

  /* ================= UI ================= */

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>GMAX Loyalty Program Registration</CardTitle>
          <CardDescription>
            Join our loyalty program and enjoy exclusive benefits and rewards
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showSuccess && (
            <Alert className="mb-6 border-green-500 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Registration successful! Your loyalty card has been created.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                {...register('fullName', { required: 'Full name is required' })}
              />
              {errors.fullName && (
                <p className="text-sm text-red-500">{errors.fullName.message}</p>
              )}
            </div>

            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber">
                Contact Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="contactNumber"
                {...register('contactNumber', {
                  required: 'Contact number is required',
                  validate: validateContactNumber,
                })}
                maxLength={11}
              />
              {errors.contactNumber && (
                <p className="text-sm text-red-500">{errors.contactNumber.message}</p>
              )}
            </div>

            {/* Birthday & Age */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthday">
                  Birthday <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="date"
                  id="birthday"
                  {...register('birthday', { required: true })}
                />
              </div>
              <div className="space-y-2">
                <Label>Age</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-gray-50">
                  {birthday ? calculateAge(birthday) : '-'}
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label>Gender</Label>
              <Select onValueChange={(value) => setValue('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Non-Binary">Non-Binary</SelectItem>
                  <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('gender', { required: true })} />
            </div>

            {/* Marital Status */}
            <div className="space-y-2">
              <Label>Marital Status</Label>
              <Select onValueChange={(value) => setValue('maritalStatus', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select marital status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Married with Kids">Married with Kids</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('maritalStatus', { required: true })} />
            </div>

            {/* Customer Type */}
            <div className="space-y-2">
              <Label>
                Customer Type <span className="text-red-500">*</span>
              </Label>
              <Select
                onValueChange={(value) =>
                  setValue('customerType', value as 'Customer' | 'Reseller')
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Customer">Customer</SelectItem>
                  <SelectItem value="Reseller">Reseller</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('customerType', { required: true })} />
            </div>

            {/* Reseller Store Details */}
            {customerType === 'Reseller' && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
                <div className="space-y-2">
                  <Label>
                    Do you have a physical store? <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setValue('hasPhysicalStore', value as 'Yes' | 'No')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                  <input
                    type="hidden"
                    {...register('hasPhysicalStore', {
                      required: customerType === 'Reseller',
                    })}
                  />
                </div>

                {hasPhysicalStore === 'Yes' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        Store Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        {...register('storeName', {
                          required:
                            'Store name is required for resellers with a physical store',
                        })}
                      />
                      {errors.storeName && (
                        <p className="text-sm text-red-500">
                          {errors.storeName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Store Address</Label>
                      <Input {...register('storeAddress')} />
                    </div>

                    <div className="space-y-2">
                      <Label>TIN Number</Label>
                      <Input {...register('tinNumber')} />
                    </div>
                  </div>
                )}

                {hasPhysicalStore === 'No' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>
                        Sales Channel <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Shopee, Lazada, Facebook, Instagram"
                        {...register('salesChannel', {
                          required:
                            'Sales channel is required for resellers without a physical store',
                        })}
                      />
                      {errors.salesChannel && (
                        <p className="text-sm text-red-500">
                          {errors.salesChannel.message}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder='Enter your email address' {...register('email', { validate: validateEmail })} />
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>City</Label>
              <Select onValueChange={(value) => setValue('city', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Angono">Angono</SelectItem>
                  <SelectItem value="Antipolo">Antipolo</SelectItem>
                  <SelectItem value="Bacoor">Bacoor</SelectItem>
                  <SelectItem value="Biñan">Biñan</SelectItem>
                  <SelectItem value="Binangonan">Binangonan</SelectItem>
                  <SelectItem value="Bocaue">Bocaue</SelectItem>
                  <SelectItem value="Cabuyao">Cabuyao</SelectItem>
                  <SelectItem value="Cainta">Cainta</SelectItem>
                  <SelectItem value="Caloocan">Caloocan</SelectItem>
                  <SelectItem value="Cavite City">Cavite City</SelectItem>
                  <SelectItem value="Dasmariñas">Dasmariñas</SelectItem>
                  <SelectItem value="General Trias">General Trias</SelectItem>
                  <SelectItem value="Imus">Imus</SelectItem>
                  <SelectItem value="Kawit">Kawit</SelectItem>
                  <SelectItem value="Las Piñas">Las Piñas</SelectItem>
                  <SelectItem value="Makati">Makati</SelectItem>
                  <SelectItem value="Malabon">Malabon</SelectItem>
                  <SelectItem value="Malolos">Malolos</SelectItem>
                  <SelectItem value="Mandaluyong">Mandaluyong</SelectItem>
                  <SelectItem value="Manila">Manila</SelectItem>
                  <SelectItem value="Marikina">Marikina</SelectItem>
                  <SelectItem value="Marilao">Marilao</SelectItem>
                  <SelectItem value="Meycauayan">Meycauayan</SelectItem>
                  <SelectItem value="Muntinlupa">Muntinlupa</SelectItem>
                  <SelectItem value="Navotas">Navotas</SelectItem>
                  <SelectItem value="Parañaque">Parañaque</SelectItem>
                  <SelectItem value="Pasay">Pasay</SelectItem>
                  <SelectItem value="Pasig">Pasig</SelectItem>
                  <SelectItem value="Quezon City">Quezon City</SelectItem>
                  <SelectItem value="Rodriguez (Montalban)">Rodriguez (Montalban)</SelectItem>
                  <SelectItem value="San Jose del Monte">San Jose del Monte</SelectItem>
                  <SelectItem value="San Juan">San Juan</SelectItem>
                  <SelectItem value="San Mateo">San Mateo</SelectItem>
                  <SelectItem value="San Pedro">San Pedro</SelectItem>
                  <SelectItem value="Santa Rosa">Santa Rosa</SelectItem>
                  <SelectItem value="Silang">Silang</SelectItem>
                  <SelectItem value="Taguig">Taguig</SelectItem>
                  <SelectItem value="Taytay">Taytay</SelectItem>
                  <SelectItem value="Trece Martires">Trece Martires</SelectItem>
                  <SelectItem value="Valenzuela">Valenzuela</SelectItem>
                  <SelectItem value="other">Others</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('city')} />
            </div>

            {/* Hear About */}
            <div className="space-y-2">
              <Label>
                How did you hear about GMAX? <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(value) => setValue('hearAbout', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Walk-in">Walk-in</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Friends / Referrals">Friends / Referrals</SelectItem>
                </SelectContent>
              </Select>
              <input type="hidden" {...register('hearAbout', { required: true })} />
            </div>

            {/* CONSENTS — UNCHANGED */}
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={dataConsent}
                  onCheckedChange={(checked) => setDataConsent(checked as boolean)}
                />
                <Label className="text-sm font-normal cursor-pointer">
                  I agree to the collection and processing of my data for the Loyalty Program{' '}
                  <span className="text-red-500">*</span>
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  checked={marketingConsent}
                  onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                />
                <Label className="text-sm font-normal cursor-pointer">
                  I agree to receive promotions via SMS, Viber, and Email (optional, opt-out anytime)
                </Label>
              </div>
            </div>

            {!dataConsent && (
              <p className="text-sm text-red-500">
                You must agree to the data collection consent to register
              </p>
            )}

            <Button type="submit" className="w-full" disabled={!dataConsent}>
              Register Now
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
