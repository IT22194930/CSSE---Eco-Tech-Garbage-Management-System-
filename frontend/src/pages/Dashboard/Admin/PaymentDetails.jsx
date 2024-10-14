import useAxiosFetch from "../../../hooks/useAxiosFetch";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const PaymentDetails = () => {
    const axiosFetch = useAxiosFetch();
    const axiosSecure = useAxiosSecure();  
    const [paymentDetails, setPaymentDetails] = useState({});

    useEffect(() => {
        axiosFetch
          .get("/api/payments")
          .then((res) => {
            const specialReq = res.data.filter((request) => request.type != "Normal Waste");
            setSpecialRequests(specialReq);
          })
          .catch((err) => console.log(err));
      }, []);
};

export default PaymentDetails;