'use client';

import { useEffect, useState } from 'react';

import { SignalWithTargets } from '@/types/signal';
import { Loader2, Plus, Save, X } from 'lucide-react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/toast-context';

interface EditSignalModalProps {
  isOpen: boolean;
  onClose: () => void;
  signal: SignalWithTargets;
  onSuccess?: (updated: SignalWithTargets) => void;
}

interface FormData {
  pair: string;
  market: string;
  action: string;
  entryZone: string;
  stopLoss: string;
  takeProfit: { price: string; gain: number }[];
  note: string;
}

interface FormErrors {
  pair?: string;
  entryZone?: string;
  stopLoss?: string;
  takeProfit?: string[];
  error?: string;
}

const formDataSchema = z.object({
  pair: z.string().min(1, 'Trading pair is required'),
  market: z.string(),
  action: z.string(),
  entryZone: z.number().min(0, 'Entry price is required'),
  stopLoss: z
    .number()
    .nullable()
    .refine((val) => {
      if (!val) return true;
      return val > 0;
    }, 'Stop loss must be greater than 0'),
  takeProfit: z
    .array(z.object({ price: z.number(), gain: z.number() }))
    .min(1, 'At least one target is required')
    .refine((targets) => {
      return targets.every((t) => t.price > 0);
    }, 'All targets must be greater than 0'),
  note: z.string().optional(),
});

const calculatePotentialGains = (targetPrice: number, entryPrice: number): number => {
  if (!entryPrice || !targetPrice) return 0;
  return ((targetPrice - entryPrice) / entryPrice) * 100;
};

export function EditSignalModal({ isOpen, onClose, signal, onSuccess }: EditSignalModalProps) {
  const [formData, setFormData] = useState<FormData>({
    pair: '',
    market: 'SPOT',
    action: 'BUY',
    entryZone: '',
    stopLoss: '',
    takeProfit: [{ price: '', gain: 0 }],
    note: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (signal) {
      setFormData({
        pair: signal.pair,
        market: signal.market,
        action: signal.action,
        entryZone: signal.entryZone.toString(),
        stopLoss: signal.stopLoss?.toString() || '',
        takeProfit: signal.targets.map((target) => ({
          price: target.price.toString(),
          gain: target.gain,
        })),
        note: signal.note || '',
      });
    }
  }, [signal]);

  const recalculateAllGains = (entryPrice: number, takeProfits: typeof formData.takeProfit) => {
    return takeProfits.map((target: { price: string; gain: number }) => ({
      price: target.price,
      gain: Number(calculatePotentialGains(Number(target.price), entryPrice).toFixed(2)),
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const newState = {
        ...prev,
        [field]: field === 'stopLoss' && !value ? '' : value,
      };

      // Recalculate gains when entry price changes
      if (field === 'entryZone' && value) {
        newState.takeProfit = recalculateAllGains(Number(value), prev.takeProfit);
      }

      return newState;
    });

    if (formErrors[field as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleTakeProfitChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updatedTakeProfits = [...prev.takeProfit];
      updatedTakeProfits[index] = {
        price: value,
        gain: Number(calculatePotentialGains(Number(value), Number(prev.entryZone)).toFixed(2)),
      };
      return { ...prev, takeProfit: updatedTakeProfits };
    });

    if (formErrors.takeProfit) {
      setFormErrors((prev) => ({ ...prev, takeProfit: undefined }));
    }
  };

  const validateInputs = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!formData.pair.trim()) {
      errors.pair = 'Trading pair is required';
      isValid = false;
    }

    const entryZoneNum = Number(formData.entryZone);
    if (!entryZoneNum || entryZoneNum <= 0) {
      errors.entryZone = 'Valid entry price is required';
      isValid = false;
    }

    const stopLossNum = Number(formData.stopLoss);
    if (formData.stopLoss && (isNaN(stopLossNum) || stopLossNum <= 0)) {
      errors.stopLoss = 'Stop loss must be a valid number greater than 0';
      isValid = false;
    }

    if (formData.stopLoss && stopLossNum >= entryZoneNum) {
      errors.stopLoss = 'Stop loss must be less than entry price';
      isValid = false;
    }

    const validTargets = formData.takeProfit.filter((t) => Number(t.price) > 0);
    if (validTargets.length === 0) {
      errors.takeProfit = ['At least one valid target is required'];
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    if (!validateInputs()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const validTargets = formData.takeProfit
        .filter((t) => Number(t.price) > 0)
        .map((t) => ({
          price: Number(t.price),
          gain: t.gain,
        }));

      const formDataValidated = formDataSchema.parse({
        ...formData,
        entryZone: Number(formData.entryZone),
        stopLoss: formData.stopLoss ? Number(formData.stopLoss) : null,
        takeProfit: validTargets,
      });

      const response = await fetch(`/api/signals/${signal.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataValidated),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update signal');
      }

      const updated: SignalWithTargets = await response.json();
      toast({
        title: 'Success',
        description: 'Signal updated successfully!',
      });
      onSuccess?.(updated);
      onClose();
    } catch (error) {
      console.error({ error });
      setSubmitError(error instanceof Error ? error.message : 'Failed to update signal');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTakeProfit = () => {
    if (formData.takeProfit.length < 8) {
      setFormData((prev) => ({
        ...prev,
        takeProfit: [...prev.takeProfit, { price: '', gain: 0 }],
      }));
    }
  };

  const removeTakeProfit = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      takeProfit: prev.takeProfit.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-xl overflow-hidden p-0">
        <DialogHeader className="border-b bg-background p-6">
          <DialogTitle>Edit Signal</DialogTitle>
          <DialogDescription>Modify the signal details.</DialogDescription>
        </DialogHeader>

        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 max-h-[calc(90vh-8rem)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 p-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Trading Pair</p>
                <Input
                  placeholder="e.g., BTC/USDT"
                  value={formData.pair}
                  onChange={(e) => handleInputChange('pair', e.target.value)}
                  error={formErrors.pair}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Action</p>
                <Select
                  value={formData.action.toLowerCase()}
                  onValueChange={(value: string) =>
                    handleInputChange('action', value.toUpperCase())
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="buy">Buy</SelectItem>
                    <SelectItem value="sell">Sell</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Entry Price</p>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Entry Price"
                  value={formData.entryZone}
                  onChange={(e) => handleInputChange('entryZone', e.target.value)}
                  error={formErrors.entryZone}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Stop Loss (Optional)</p>
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="Optional"
                  value={formData.stopLoss}
                  onChange={(e) => handleInputChange('stopLoss', e.target.value)}
                  error={formErrors.stopLoss}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Take Profit Targets</p>
                  <p className="text-xs text-muted-foreground">At least 1 target required</p>
                </div>
                <Button
                  type="button"
                  onClick={addTakeProfit}
                  variant="outline"
                  size="sm"
                  disabled={formData.takeProfit.length >= 8}
                >
                  <Plus className="size-4" />
                  Add Target
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {formData.takeProfit.map((profit, index) => (
                  <div key={index} className="relative space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-muted-foreground">
                        Target {index + 1}
                      </p>
                      {Number(profit.price) > 0 && (
                        <p
                          className={`text-xs font-medium ${profit.gain >= 0 ? 'text-emerald-500' : 'text-red-500'}`}
                        >
                          {profit.gain.toFixed(2)}%
                        </p>
                      )}
                    </div>
                    <div className="relative">
                      <Input
                        type="text"
                        inputMode="decimal"
                        placeholder={`Target ${index + 1}`}
                        value={profit.price}
                        onChange={(e) => handleTakeProfitChange(index, e.target.value)}
                        error={formErrors.takeProfit?.[index]}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 size-6 -translate-y-1/2 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => removeTakeProfit(index)}
                        >
                          <X className="size-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Analysis & Notes</p>
              <Textarea
                placeholder="Add your technical analysis and important note here..."
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                className="min-h-[100px]"
              />
              {submitError && <p className="text-sm text-destructive">{submitError}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="w-full"
                disabled={isSubmitting}
              >
                <X className="size-4" />
                Cancel
              </Button>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 size-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
