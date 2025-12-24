import { requireRole } from "@/lib/requireRole";
import React, { memo, useState } from "react";

function Home({ user }) {
  return <div>Home</div>;
}

export default memo(Home);

export const getServerSideProps = requireRole("home")();
