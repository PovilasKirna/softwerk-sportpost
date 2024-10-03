import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import StripePaymentElement from './stripe-payment-element';
import CheckoutForm from './checkout-form';

type PlanOptions = {
    amount: number;
    // Add more options here
};

export function CheckoutDialog({ children, options }: { children: React.ReactNode; options: PlanOptions }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="w-fit">
                <AlertDialogHeader>
                    <StripePaymentElement>
                        <CheckoutForm amount={options.amount} />
                    </StripePaymentElement>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    );
}
