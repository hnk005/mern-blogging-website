import { PropsWithChildren } from "react";
import DataLoader from "../loader/DataLoader";
import NoDataMessage from "../messages/NoDataMessage";

interface HandleFetchProps extends PropsWithChildren {
  data: any;
  isLoading: boolean;
  isError: boolean;
  messageNoData?: string;
  refetch?: () => void;
}

const HandleFetch = ({
  data,
  isLoading,
  isError,
  messageNoData,
  refetch,
  children,
}: HandleFetchProps) => {
  if (isLoading) {
    return <DataLoader size={35} />;
  }

  if (isError) {
    return (
      <div className="flex flex-col gap-4">
        <NoDataMessage message="An error occurred while fetching. Please try again later." />
        <button onClick={refetch} className="tag self-center">
          <i className="fi fi-rr-refresh"></i> Refetch
        </button>
      </div>
    );
  } else if (data != undefined && data != null) {
    if (Array.isArray(data)) {
      if (data.length > 0) {
        return children;
      } else {
        return messageNoData && <NoDataMessage message={messageNoData} />;
      }
    } else {
      return children;
    }
  } else {
    return messageNoData && <NoDataMessage message={messageNoData} />;
  }
};

export default HandleFetch;
