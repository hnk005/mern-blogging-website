import { PropsWithChildren } from "react";
import DataLoader from "../loader/DataLoader";
import NoDataMessage from "../messages/NoDataMessage";

interface HandleFetchProps extends PropsWithChildren {
  data: any;
  isLoading: boolean;
  isError: boolean;
  messageNoData: string;
}

const HandleFetch = ({
  data,
  isLoading,
  isError,
  messageNoData,
  children,
}: HandleFetchProps) => {
  if (isLoading) {
    return <DataLoader size={35} />;
  }

  if (isError) {
    return (
      <NoDataMessage message="An error occurred while fetching. Please try again later." />
    );
  } else if (data != undefined && data != null) {
    if (Array.isArray(data)) {
      if (data.length > 0) {
        return children;
      } else {
        return <NoDataMessage message={messageNoData} />;
      }
    } else {
      return children;
    }
  } else {
    return <NoDataMessage message={messageNoData} />;
  }
};

export default HandleFetch;
