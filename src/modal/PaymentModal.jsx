import "./paymentModal.css";

const PaymentModal = ({ totalPrice, timer, closeModal }) => {
  return (
    <div className="modal">
      <button className="close-btn" onClick={closeModal}>
        ✖
      </button>
      <div className="modal-content">
        <h3>Payment Details</h3>
        <p>
          Amount to transfer: <span id="amount">${totalPrice.toFixed(2)}</span>
        </p>
        <p>
          Transfer to: SCB
          <br />
          Account No: 123-456-789
          <br />
          Account Name: Itadori Yuji
        </p>
        <div>Time remaining: {timer}s</div>

        {timer === 0 ? (
          <p>The transaction has expired!</p>
        ) : (
          <div>
            <button className="done-button" onClick={closeModal}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
