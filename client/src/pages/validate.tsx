import { Button } from "@/components/ui/button";
import { useState } from "react";

function Validate() {
  const [glossData, setGlossData] = useState<
    { id: number; gloss: string; isValid: boolean | null }[]
  >([
    { id: 1, gloss: "", isValid: null },
    { id: 2, gloss: "ASL Gloss 2", isValid: null },
    // Add more ASL glosses here
    

  ]);

  const handleValidation = (id: number, isValid: boolean) => {
    const updatedGlossData = glossData.map((item) =>
      item.id === id ? { ...item, isValid } : item
    );
    setGlossData(updatedGlossData);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">ASL Gloss Validation</h1>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="p-2 border border-gray-300">ID</th>
            <th className="p-2 border border-gray-300">ASL Gloss</th>
            <th className="p-2 border border-gray-300">Validation</th>
          </tr>
        </thead>
        <tbody>
          {glossData.map((item) => (
            <tr key={item.id}>
              <td className="p-2 border border-gray-300">{item.id}</td>
              <td className="p-2 border border-gray-300">{item.gloss}</td>
              <td className="p-2 border border-gray-300">
                <div className="flex justify-center space-x-4">
                  <Button
                    className="bg-green-500 px-8"
                    onClick={() => handleValidation(item.id, true)}
                  >
                    Valid
                  </Button>
                  <Button
                    className="px-8"
                    variant="destructive"
                    onClick={() => handleValidation(item.id, false)}
                  >
                    Not Valid
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Validate;
