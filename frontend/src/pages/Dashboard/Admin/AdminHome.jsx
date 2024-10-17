import React, { useEffect, useState } from "react";
import useUser from "../../../hooks/useUser";
import useAxiosFetch from "../../../hooks/useAxiosFetch";
import GarbageRequestCount from "../../../components/AdminHome/GarbageRequestCount";
import PendingRequestsCount from "../../../components/AdminHome/PendingRequestsCount";
import AcceptedRequestsCount from "../../../components/AdminHome/AcceptedRequestsCount";
import RejectedRequestsCount from "../../../components/AdminHome/RejectedRequestsCount";
import UsersCount from "../../../components/AdminHome/UsersCount";

const AdminHome = () => {
  const { currentUser } = useUser();
  const axiosFetch = useAxiosFetch();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axiosFetch
      .get("/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  

  return (
    <div>
      <div>
        <h1 className="text-4xl font-bold my-7">
          Welcome Back,{" "}
          <span className="text-secondary">{currentUser?.name}</span> !
        </h1>

        <div
        className="flex flex-col sm:flex-row gap-0 relative w-full"
        data-aos="fade-up"
        data-aos-duration="1500"
      >
        <UsersCount/>
        <GarbageRequestCount />
        <PendingRequestsCount/>
        <AcceptedRequestsCount/>
        <RejectedRequestsCount/>
      </div>
      </div>
    </div>
  );
};

export default AdminHome;
