import { Ballot } from "@delvtech/council-viem";
import assertNever from "assert-never";
import { ReactElement } from "react";

interface FormattedBallotProps {
  ballot: Ballot;
}

export default function FormattedBallot({
  ballot,
}: FormattedBallotProps): ReactElement {
  switch (ballot) {
    case "yes":
      return <h2 className="font-bold uppercase text-success">YES</h2>;

    case "no":
      return <h2 className="font-bold uppercase text-error">NO</h2>;

    case "maybe":
      return <h2 className="font-bold uppercase">ABSTAIN</h2>;

    default:
      assertNever(ballot);
  }
}
