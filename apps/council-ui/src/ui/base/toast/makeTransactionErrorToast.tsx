import { XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { makeEtherscanTransactionURL } from "src/etherscan/makeEtherscanTransactionURL";

export function makeTransactionErrorToast(
  message: string,
  hash: string | undefined,
): void {
  toast.error(
    <div className="flex gap-4 items-center">
      <div>
        <p>{message}</p>
        {hash && (
          <p>
            <a href={makeEtherscanTransactionURL(hash)} className="underline">
              View on Etherscan
            </a>
          </p>
        )}
      </div>
      <button
        onClick={() => toast.dismiss(hash)}
        className="daisy-btn daisy-btn-circle daisy-btn-sm daisy-btn-ghost group"
      >
        <XMarkIcon className="w-5 opacity-50 group-hover:opacity-100 transition-all" />
      </button>
    </div>,
    {
      id: hash,
      // It might be useful to keep the etherscan link around to investigate the
      // error until explicitly dismissed.
      duration: hash ? Infinity : 5000,
    },
  );
}
