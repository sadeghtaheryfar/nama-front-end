import MainMaktob from "../../../components/masajed/maktop/main-maktob/main-maktob";
import { cookies } from "next/headers";

const Maktob = () => {
    const token = cookies().get("token")?.value;
    return (
        <MainMaktob token={token}/>
    );
}

export default Maktob;