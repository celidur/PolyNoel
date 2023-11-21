
import HTTPManager from "../assets/js/http_manager";
import ChangePrice from "../components/ChangePrice";

export default function GenericSettings() : JSX.Element {
    
    const httpManager = new HTTPManager();
    const resetSetings = () => {
        httpManager.selectAllCategories().then(()=>{
            console.log("test");
        });
        httpManager.setPriceBorn({inferior:0, superior:4294967295});
    }
    return (
        <>
            <ChangePrice></ChangePrice>
            <button onClick={resetSetings}>Reset Settings</button>
        </>
    );
}