import { Ballot } from "@council/sdk";
import { ReactElement } from "react";

interface FormattedBallotProps {
  ballot: Ballot;
}

export default function FormattedBallot({
  ballot,
}: FormattedBallotProps): ReactElement {
  switch (ballot) {
    case "yes":
      return <h2 className="font-semibold uppercase text-success">YES</h2>;

    case "no":
      return <h2 className="font-semibold uppercase text-error">NO</h2>;

    case "maybe":
      return <h2 className="font-semibold uppercase">ABSTAIN</h2>;
  }
}
