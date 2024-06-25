import { XMarkIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import { SupportedChainId } from "src/config/council.config";
import { makeEtherscanTransactionURL } from "src/utils/etherscan/makeEtherscanTransactionURL";

export function makeTransactionSuccessToast(
  message: string,
  hash: string,
  chainId: SupportedChainId,
): void {
  toast.success(
    <div className="flex items-center gap-4">
      <div>
        <p>{message}</p>
        <p>
          <a
            href={makeEtherscanTransactionURL(hash, chainId)}
            className="underline"
            target="_blank"
            rel="noreferrer"
          >
            View on Etherscan
          </a>
        </p>
      </div>
      <button
        onClick={() => toast.dismiss(hash)}
        className="group daisy-btn daisy-btn-circle daisy-btn-ghost daisy-btn-sm"
      >
        <XMarkIcon className="w-5 opacity-50 transition-all group-hover:opacity-100" />
      </button>
    </div>,
    {
      id: hash,
      duration: 5000,
    },
  );
}
