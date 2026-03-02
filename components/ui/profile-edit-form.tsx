'use client';

import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';

import {
  type CountryCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import { Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ProfileEditFormProps {
  initialData: {
    fullName: string;
    phoneNumber: string;
  };
  onSubmit: (data: { fullName: string; phoneNumber: string }) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

function getInitialPhoneNumber(phoneNumber: string): string {
  if (!phoneNumber) return '';

  try {
    // If it's already a valid number with +, return it
    if (phoneNumber.startsWith('+')) {
      return phoneNumber;
    }

    // Try to parse with + prefix
    const withPlus = `+${phoneNumber}`;
    return withPlus;
  } catch {
    return `+${phoneNumber}`;
  }
}

function getCountryFromNumber(phoneNumber: string): CountryCode {
  if (!phoneNumber) return 'MA';

  try {
    const numberWithPlus = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const parsedNumber = parsePhoneNumberFromString(numberWithPlus);
    return (parsedNumber?.country || 'MA') as CountryCode;
  } catch {
    return 'MA';
  }
}

export function ProfileEditForm({
  initialData,
  onSubmit,
  onCancel,
  isSaving,
}: ProfileEditFormProps) {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName,
    phoneNumber: '',
  });
  const [phoneError, setPhoneError] = useState('');

  // Set initial phone number on mount
  useEffect(() => {
    if (initialData.phoneNumber) {
      const formattedNumber = getInitialPhoneNumber(initialData.phoneNumber);
      setFormData((prev) => ({
        ...prev,
        phoneNumber: formattedNumber,
      }));
    }
  }, [initialData.phoneNumber]);

  const handlePhoneChange = (value: string | undefined) => {
    const phoneNumber = value || '';
    setFormData((prev) => ({ ...prev, phoneNumber }));

    if (!phoneNumber) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      setPhoneError('Invalid phone number');
      return;
    }

    setPhoneError('');
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.phoneNumber) {
      setPhoneError('Phone number is required');
      return;
    }

    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setPhoneError('Invalid phone number');
      return;
    }

    try {
      const parsedPhone = parsePhoneNumberFromString(formData.phoneNumber);
      if (!parsedPhone) {
        setPhoneError('Invalid phone number format');
        return;
      }

      await onSubmit({
        ...formData,
        phoneNumber: parsedPhone.countryCallingCode + parsedPhone.nationalNumber,
      });
    } catch {
      setPhoneError('Invalid phone number format');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="text-sm font-medium">Full Name</label>
        <Input
          type="text"
          value={formData.fullName}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setFormData({ ...formData, fullName: e.target.value })
          }
          required
          minLength={2}
          className="mt-1.5"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Phone Number</label>
        <style jsx global>{`
          .PhoneInputInput {
            margin-left: 0.5rem !important;
            background: none !important;
            border: none !important;
            padding: 0 !important;
            outline: none !important;
          }
          .PhoneInputCountry {
            margin-right: 0.25rem !important;
          }
        `}</style>
        <div className="mt-1.5">
          <PhoneInput
            international
            countryCallingCodeEditable={false}
            defaultCountry={getCountryFromNumber(initialData.phoneNumber)}
            value={formData.phoneNumber}
            onChange={handlePhoneChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
          {phoneError && <p className="mt-1 text-sm text-destructive">{phoneError}</p>}
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isSaving || !!phoneError}>
          {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
