import { Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function IdGenerator() {
  const [uuid, setUuid] = useState(uuidv4());
  return (
    <>
      <div className="flex items-center space-x-5">
        <h1>{uuid}</h1>
        <button onClick={() => setUuid(uuidv4())}>
          <RefreshCw size={20} />
        </button>
        <button onClick={() => navigator.clipboard.writeText(uuid)}>
          <Copy size={20} />
        </button>
      </div>
    </>
  );
}
