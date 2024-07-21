import { useState } from "react";
import { InputCheckbox } from "../InputCheckbox";
import { TransactionPaneComponent } from "./types";

export const TransactionPane: TransactionPaneComponent = ({
  transaction,
  loading,
  setTransactionApproval: consumerSetTransactionApproval,
}) => {
  const [approved, setApproved] = useState(transaction.approved);
  const [approvalLoading, setApprovalLoading] = useState(false);  // New loading state for approval process

  const handleApprovalChange = async (newValue: boolean) => {
    setApprovalLoading(true);  // Start loading
    try {
      await consumerSetTransactionApproval({
        transactionId: transaction.id,
        newValue,
      });
      setApproved(newValue);
    } finally {
      setApprovalLoading(false);  // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="RampPane" style={{ cursor: loading || approvalLoading ? 'wait' : 'default' }}>
      <div className="RampPane--content">
        <p className="RampText">{transaction.merchant}</p>
        <b>{moneyFormatter.format(transaction.amount)}</b>
        <p className="RampText--hushed RampText--s">
          {transaction.employee.firstName} {transaction.employee.lastName} - {transaction.date}
        </p>
      </div>
      <InputCheckbox
        id={transaction.id}
        checked={approved}
        disabled={loading || approvalLoading}  // Disable during loading
        onChange={handleApprovalChange}
      />
    </div>
  );
};

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});
