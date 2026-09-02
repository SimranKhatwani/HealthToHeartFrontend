import { useSelector } from "react-redux";
export const Table = ({ children }) => (
  <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800">
    <table className="min-w-[640px] w-full text-left">
      {children}
    </table>
  </div>
);


export const TableHeader = ({ children }) => {
  const { mode } = useSelector((state) => state.theme);
  return(
    <thead className={`${mode === "dark" ? "" : "bg-gray-100"}`}>{children}</thead>
  )
  
};

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableRow = ({ children }) => (
  <tr className="border-b border-gray-200">{children}</tr>
);

export const TableCell = ({ children }) => (
  <td className="px-4 py-3">{children}</td>
);

export const TableHead = ({ children }) => (
  <th className="px-4 py-3 font-semibold text-gray-600">{children}</th>
);
