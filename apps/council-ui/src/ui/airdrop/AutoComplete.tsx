import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { memo, ReactElement, useRef } from "react";
import { VoterRowData } from "src/ui/voters/types";

interface Props {
  voters: VoterRowData[] | undefined;
  onChange(val: string): void;
}

const Autocomplete = (props: Props): ReactElement => {
  const { voters, onChange } = props;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="relative" ref={ref}>
      <div className="relative">
        <input
          type="text"
          className="w-full daisy-input-bordered daisy-input pr-8"
          onChange={(e) => onChange(e.target.value)}
          tabIndex={0}
        />
        <MagnifyingGlassIcon className="h-5 w-5 absolute top-4 right-2" />
      </div>
      {voters && voters.length > 0 ? (
        <div className="dasiy-dropdown-content bg-base-200 absolute top-12 max-h-56 w-full overflow-auto flex-col rounded-md">
          <table className="daisy-table w-full">
            <thead>
              <tr>
                <th>Voter</th>
                <th>Voting Power</th>
              </tr>
            </thead>
            <tbody>
              {voters.map((voter, index) => {
                return (
                  <tr
                    className="border-b border-b-base-content/10 cursor-pointer"
                    key={voter.address}
                    tabIndex={index + 1}
                    onClick={() => {
                      //TODO:
                      //handle click
                    }}
                  >
                    <td className="flex items-center gap-1">
                      <img
                        alt={voter.ensName ?? voter.address}
                        src={"voter."}
                        width={10}
                        height={15}
                      />
                      <p>{voter.ensName}</p>
                    </td>
                    <td>{voter.votingPower}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
};

export default memo(Autocomplete);
