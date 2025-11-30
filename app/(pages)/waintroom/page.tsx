import React, { Suspense } from "react";
import WaitingRoomClient from "./WaitingRoomClient";

export default function WaitingRoomPage() {
  return (
    <Suspense fallback={null}>
      <WaitingRoomClient />
    </Suspense>
  );
}
