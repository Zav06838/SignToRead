import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { UserButton, useClerk, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { ModeToggle } from "@/components/mode-toggle";
import Nav from "@/pages/Nav";

const HistoryPage: React.FC = () => {
  const history = useSelector((state: RootState) => state.historyModel.items);

  // Define a function to split the history items into rows of 2 items each
  const splitHistoryIntoRows = (historyItems: any[]) => {
    const rows: any[] = [];
    for (let i = 0; i < historyItems.length; i += 2) {
      const row = historyItems.slice(i, i + 2);
      rows.push(row);
    }
    return rows;
  };

  // Get the rows of history items
  const historyRows = splitHistoryIntoRows(history);

  return (
    <div className="main">
      {/* Navbar */}
      <Nav />
      {/* Main container */}
      <div className="flex justify-center items-center mt-48">
        <div className="container p-4 max-w-4xl bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Gloss History
          </h2>
          {history.length === 0 ? (
            <p className="text-center text-gray-600">No history items found.</p>
          ) : (
            <div className="space-y-4">
              {historyRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`${
                    row.length === 1 ? "grid-cols-1" : "grid-cols-2"
                  } grid gap-4`}
                >
                  {row.map(
                    (
                      item: {
                        input:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | null
                          | undefined;
                        output:
                          | string
                          | number
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | null
                          | undefined;
                        video: string | undefined;
                      },
                      index: React.Key | null | undefined
                    ) => (
                      <div
                        key={index}
                        className={`${
                          row.length === 1
                            ? "col-span-1"
                            : "col-span-1 md:col-span-1"
                        } bg-gray-50 rounded-lg shadow p-4`}
                      >
                        <div className="font-medium text-gray-600">
                          <span className="text-[#3f62c4]">Input Text:</span>{" "}
                          {item.input}
                        </div>
                        <div className="mt-2 text-gray-700">
                          <span className="text-[#3f62c4]">Gloss:</span>{" "}
                          {item.output}
                        </div>
                        {item.video && (
                          <div className="mt-2">
                            <span className="text-[#3f62c4]">PSL Video:</span>
                            <video
                              src={item.video}
                              controls
                              className="w-full"
                            ></video>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    // </div>
  );
};

export default HistoryPage;
