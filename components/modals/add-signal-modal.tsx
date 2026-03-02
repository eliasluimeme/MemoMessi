'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Plus,
  RocketIcon,
  Search,
  ShieldAlert,
  ShieldCheck,
  X,
  Zap
} from 'lucide-react';
import { z } from 'zod';

import { Badge } from '@/components/ui/badge';
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

interface FormData {
  contractAddress: string;
  network: string;
  pair: string;
  action: string;
  entryZone: string;
  stopLoss: string;
  takeProfit: { price: string; gain: number }[];
  note: string;
}

interface FormErrors {
  contractAddress?: string;
  pair?: string;
  entryZone?: string;
  stopLoss?: string;
  takeProfit?: string[];
  error?: string;
}

const formDataSchema = z.object({
  pair: z.string().min(1, 'Trading pair is required'),
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
  contractAddress: z.string().optional(),
  network: z.string().optional(),
});

const initialFormState: FormData = {
  contractAddress: '',
  network: 'solana',
  pair: '',
  action: 'BUY',
  entryZone: '',
  stopLoss: '',
  takeProfit: [{ price: '', gain: 0 }],
  note: '',
};

const calculatePotentialGains = (targetPrice: number, entryPrice: number): number => {
  if (!entryPrice || !targetPrice) return 0;
  return ((targetPrice - entryPrice) / entryPrice) * 100;
};

export default function AddSignalModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Magic Input States
  const [isFetchingToken, setIsFetchingToken] = useState(false);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [rugCheckScore, setRugCheckScore] = useState<any>(null);

  const { toast } = useToast();

  const resetForm = () => {
    setFormData(initialFormState);
    setFormErrors({});
    setSubmitError(null);
    setTokenInfo(null);
    setRugCheckScore(null);
  };

  const recalculateAllGains = (entryPrice: number, takeProfits: typeof formData.takeProfit) => {
    return takeProfits.map((target) => ({
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
      if (field === 'entryZone' && value && !isNaN(Number(value))) {
        newState.takeProfit = recalculateAllGains(Number(value), prev.takeProfit);
      }

      return newState;
    });

    if (formErrors[field as keyof FormErrors])
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
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

  const fetchGeckoToken = async () => {
    if (!formData.contractAddress) {
      setFormErrors((prev) => ({ ...prev, contractAddress: 'CA is required for magic input' }));
      return;
    }

    setIsFetchingToken(true);
    setSubmitError(null);
    setTokenInfo(null);
    setRugCheckScore(null);

    try {
      // 1. Fetch token data from GeckoTerminal
      const geckoRes = await fetch(
        `https://api.geckoterminal.com/api/v2/networks/${formData.network}/tokens/${formData.contractAddress}`
      );
      const data = await geckoRes.json();

      if (!data?.data?.attributes) {
        throw new Error('Token not found on GeckoTerminal');
      }

      const attrs = data.data.attributes;
      const price = Number(attrs.price_usd);
      const symbol = attrs.symbol.toUpperCase();

      setTokenInfo({
        name: attrs.name,
        symbol: symbol,
        price: price,
        liquidity: attrs.total_reserve_in_usd,
        volume: attrs.volume_usd?.h24,
      });

      // 2. Pre-fill basic pair and entry data
      setFormData((prev) => {
        const newState = {
          ...prev,
          pair: `${symbol}/USDT`,
          entryZone: price.toString(),
        };
        newState.takeProfit = recalculateAllGains(price, newState.takeProfit);
        return newState;
      });

      // 3. Optional: Fetch RugCheck for Solana
      if (formData.network === 'solana') {
        fetch(`https://api.rugcheck.xyz/v1/tokens/${formData.contractAddress}/report/summary`)
          .then((res) => res.json())
          .then((rug) => {
            // simplified logic
            const isRugged = rug?.rugged || false;
            const risks = rug?.risks?.length || 0;
            setRugCheckScore({ isRugged, risks, score: rug?.score || 0 });
          })
          .catch((err) => console.log('RugCheck fetch failed', err));
      }

      toast({
        title: 'Token Found! 🚀',
        description: `Loaded ${attrs.name} at $${price.toFixed(6)}`,
      });

    } catch (err) {
      console.error(err);
      setSubmitError(err instanceof Error ? err.message : 'Failed to fetch token data');
    } finally {
      setIsFetchingToken(false);
    }
  };

  const applySmartZones = () => {
    if (!formData.entryZone || isNaN(Number(formData.entryZone))) {
      toast({ title: 'Error', description: 'Need a valid Entry Price first.', variant: 'destructive' });
      return;
    }

    const entry = Number(formData.entryZone);
    // +2% Entry Adjustment? Or just +5% TP1, +10% TP2, -10% SL
    const tp1 = entry * 1.05;
    const tp2 = entry * 1.10;
    const tp3 = entry * 1.20;
    const sl = entry * 0.90;

    setFormData((prev) => ({
      ...prev,
      stopLoss: sl.toFixed(8).replace(/\.?0+$/, ''),
      takeProfit: [
        { price: tp1.toFixed(8).replace(/\.?0+$/, ''), gain: calculatePotentialGains(tp1, entry) },
        { price: tp2.toFixed(8).replace(/\.?0+$/, ''), gain: calculatePotentialGains(tp2, entry) },
        { price: tp3.toFixed(8).replace(/\.?0+$/, ''), gain: calculatePotentialGains(tp3, entry) },
      ]
    }));

    toast({
      title: 'Smart Zones Applied ⚡',
      description: 'Calculated TP1 (+5%), TP2 (+10%), TP3 (+20%) and SL (-10%)',
    });
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
        pair: (formData.pair.endsWith('/USDT')
          ? formData.pair.slice(0, -5)
          : formData.pair
        ).toUpperCase() + '/USDT', // Normalize to SYMBOL/USDT
        action: formData.action,
        entryZone: Number(formData.entryZone),
        stopLoss: formData.stopLoss ? Number(formData.stopLoss) : null,
        takeProfit: validTargets,
        note: formData.note,
        contractAddress: formData.contractAddress,
        network: formData.network,
      });

      const response = await fetch('/api/postsignals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formDataValidated),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || 'Failed to create signal');

      toast({
        title: 'Success',
        description: 'Signal posted successfully!',
      });
      resetForm();
      onClose();
      window.location.reload();
    } catch (error) {
      console.error({ error });
      setSubmitError(error instanceof Error ? error.message : 'Failed to post signal');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-hidden p-0">
        <DialogHeader className="border-b bg-background p-6">
          <DialogTitle>Add Signal 🚀</DialogTitle>
          <DialogDescription>
            Use Magic Input to instantly fetch token details or enter manually.
          </DialogDescription>
        </DialogHeader>

        <div className="scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700 max-h-[calc(90vh-8.5rem)] overflow-y-auto">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-6">

            {/* The Magic Input Section */}
            <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-5">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-blue-500">Magic Input</h3>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-none">
                  <Select
                    value={formData.network}
                    onValueChange={(value) => handleInputChange('network', value)}
                  >
                    <SelectTrigger className="w-[120px] bg-background">
                      <SelectValue placeholder="Network" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solana">Solana</SelectItem>
                      <SelectItem value="base">Base</SelectItem>
                      <SelectItem value="eth">Ethereum</SelectItem>
                      <SelectItem value="bsc">BSC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Paste Contract Address (CA)"
                    className="font-mono bg-background"
                    value={formData.contractAddress}
                    onChange={(e) => handleInputChange('contractAddress', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchGeckoToken()}
                    error={formErrors.contractAddress}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 px-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-600"
                    onClick={fetchGeckoToken}
                    disabled={isFetchingToken || !formData.contractAddress}
                  >
                    {isFetchingToken ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-1" />}
                    {isFetchingToken ? '' : 'Fetch'}
                  </Button>
                </div>
              </div>

              {/* Token Info Preview */}
              {tokenInfo && (
                <div className="mt-4 flex flex-col gap-3 rounded-lg bg-background p-4 border border-border/50">
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs uppercase">Token</span>
                      <span className="font-bold">{tokenInfo.name} ({tokenInfo.symbol})</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-muted-foreground text-xs uppercase">Price</span>
                      <span className="font-medium font-mono">${tokenInfo.price.toFixed(8).replace(/\.?0+$/, '')}</span>
                    </div>
                    {tokenInfo.liquidity && (
                      <div className="flex flex-col">
                        <span className="text-muted-foreground text-xs uppercase">Liquidity</span>
                        <span>${Number(tokenInfo.liquidity).toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                      </div>
                    )}
                    {rugCheckScore && (
                      <div className="flex flex-col ml-auto">
                        <Badge variant={rugCheckScore.risks > 2 || rugCheckScore.isRugged ? 'destructive' : 'success'} className="flex items-center gap-1">
                          {rugCheckScore.risks > 2 || rugCheckScore.isRugged ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                          RugCheck: {rugCheckScore.risks > 2 ? `High Risk (${rugCheckScore.risks})` : 'Safe'}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-sm font-medium">Trading Pair</p>
                <Input
                  placeholder="e.g., SOL/USDT"
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
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Entry Price</p>
                  {tokenInfo && (
                    <Button type="button" variant="ghost" size="sm" onClick={applySmartZones} className="h-6 text-xs text-blue-500 px-2 flex gap-1">
                      <Zap className="h-3 w-3" /> Auto-fill Zones
                    </Button>
                  )}
                </div>
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

            <div className="space-y-4">
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
                  <Plus className="size-4 mr-1" />
                  Add Target
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                {formData.takeProfit.map((profit, index) => (
                  <div key={index} className="relative space-y-2 bg-muted/30 p-3 rounded-lg border">
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
                        className="pr-8 bg-background"
                        placeholder={`Price`}
                        value={profit.price}
                        onChange={(e) => handleTakeProfitChange(index, e.target.value)}
                        error={formErrors.takeProfit?.[index]}
                      />
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 size-7 -translate-y-1/2 rounded-md hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => removeTakeProfit(index)}
                        >
                          <X className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Analysis & Note (Optional)</p>
              <Textarea
                placeholder="Add your technical analysis and important note here..."
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
                className="min-h-[80px]"
              />
              {submitError && <p className="text-sm text-destructive font-medium">{submitError}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <RocketIcon className="mr-2 size-4" />
                    Post Signal
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
