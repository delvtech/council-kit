import { XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { SupportedChainId } from "src/config/council.config";
import { makeEtherscanTransactionURL } from "src/etherscan/makeEtherscanTransactionURL";

export function makeTransactionSuccessToast(
  message: string,
  hash: string,
  chainId: SupportedChainId,
): void {
  toast.success(
    <div className="flex gap-4 items-center">
      <div>
        <p>{message}</p>
        <p>
          <a
            href={makeEtherscanTransactionURL(hash, chainId)}
            className="underline"
          >
            View on Etherscan
          </a>
        </p>
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
      duration: 5000,
    },
  );
}
