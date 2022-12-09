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
      return (
        <h2 className="text-green-400 font-semibold">{ballot.toUpperCase()}</h2>
      );

    case "no":
      return (
        <h2 className="text-red-400 font-semibold">{ballot.toUpperCase()}</h2>
      );

    case "maybe":
      return <h2>{ballot.toUpperCase()}</h2>;
  }
}
