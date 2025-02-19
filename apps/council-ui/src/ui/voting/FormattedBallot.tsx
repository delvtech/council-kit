import { Ballot } from "@delvtech/council-js";
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
      return <h2 className="text-success font-bold uppercase">YES</h2>;

    case "no":
      return <h2 className="text-error font-bold uppercase">NO</h2>;

    case "maybe":
      return <h2 className="font-bold uppercase">ABSTAIN</h2>;

    default:
      assertNever(ballot);
  }
}
