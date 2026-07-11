import React, { createContext, useContext, useState } from "react";

interface CompanyContextType {
  companyCode: string;
  locationCode: string;
  companyName: string;
  locationName: string;
  userCode: string;
  userName: string;
  shortName: string;
  setCompanyData: (data: {
    companyCode: string;
    companyName: string;
    locationCode: string;
    locationName: string;
    userCode: string;
    userName: string;
    shortName: string;
  }) => void;
}

const CompanyContext = createContext<CompanyContextType | null>(null);

export const CompanyProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [companyCode, setCompanyCode] = useState(
    sessionStorage.getItem("selectedCompanyCode") || "",
  );
  const [companyName, setCompanyName] = useState(
    sessionStorage.getItem("selectedCompanyName") || "",
  );
  const [locationCode, setLocationCode] = useState(
    sessionStorage.getItem("selectedLocationCode") || "",
  );
  const [locationName, setLocationName] = useState(
    sessionStorage.getItem("selectedLocationName") || "",
  );
  const [userCode, setUserCode] = useState(
    sessionStorage.getItem("selectedUserCode") || "",
  );
  const [userName, setUserName] = useState(
    sessionStorage.getItem("selectedUserName") || "",
  );
  const [shortName, setShortName] = useState(
    sessionStorage.getItem("selectedShortName") || "",
  );

  const setCompanyData = (data: any) => {
    setCompanyCode(data.companyCode);
    setCompanyName(data.companyName);
    setLocationCode(data.locationCode);
    setLocationName(data.locationName);
    setUserCode(data.userCode);
    setUserName(data.userName);
    setShortName(data.shortName);

    sessionStorage.setItem("selectedCompanyCode", data.companyCode);
    sessionStorage.setItem("selectedCompanyName", data.companyName);
    sessionStorage.setItem("selectedLocationCode", data.locationCode);
    sessionStorage.setItem("selectedLocationName", data.locationName);
    sessionStorage.setItem("selectedUserCode", data.userCode);
    sessionStorage.setItem("selectedUserName", data.userName);
    sessionStorage.setItem("selectedShortName", data.shortName);
  };

  return (
    <CompanyContext.Provider
      value={{
        companyCode,
        companyName,
        locationCode,
        locationName,
        userCode,
        userName,
        shortName,
        setCompanyData,
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const context = useContext(CompanyContext);

  if (!context) {
    throw new Error("useCompany must be used inside CompanyProvider");
  }

  return context;
};
