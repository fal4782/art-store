import { useLocation, Link } from "react-router-dom";
import type { Artwork, OrderRequest } from "../utils/types";

export default function OrderConfirmation() {
  const location = useLocation();
  const { orderId, artwork, orderData } = location.state || {};

  if (!orderId || !artwork || !orderData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Order Not Found
        </h1>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to Home
        </Link>
      </div>
    );
  }

  const tax = artwork.price * 0.08;
  const shipping = 25;
  const total = artwork.price + tax + shipping;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been received.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-gray-50 px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Order #{orderId.slice(-8)}
                </h2>
                <p className="text-sm text-gray-600">
                  Placed on {new Date().toLocaleDateString()}
                </p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                PENDING
              </span>
            </div>
          </div>

          {/* Artwork Details */}
          <div className="p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                {artwork.images && artwork.images.length > 0 ? (
                  <img
                    src={artwork.images[0]}
                    alt={artwork.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="font-medium text-gray-900">{artwork.title}</h3>
                <p className="text-sm text-gray-600">{artwork.category}</p>
                {artwork.medium && (
                  <p className="text-xs text-gray-500">{artwork.medium}</p>
                )}
                {artwork.dimensions && (
                  <p className="text-xs text-gray-500">{artwork.dimensions}</p>
                )}
              </div>
              <div className="text-right">
                <p className="font-medium">${artwork.price.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Qty: 1</p>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${artwork.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Shipping Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Delivery Address
              </h4>
              <div className="text-sm text-gray-600">
                <p>{orderData.customerName}</p>
                <p>{orderData.shippingAddress.street}</p>
                <p>
                  {orderData.shippingAddress.city},{" "}
                  {orderData.shippingAddress.state}{" "}
                  {orderData.shippingAddress.zipCode}
                </p>
                <p>{orderData.shippingAddress.country}</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">
                Contact Information
              </h4>
              <div className="text-sm text-gray-600">
                <p>{orderData.customerEmail}</p>
                {orderData.customerPhone && <p>{orderData.customerPhone}</p>}
              </div>
            </div>
          </div>
          {orderData.notes && (
            <div className="mt-4 pt-4 border-t">
              <h4 className="font-medium text-gray-900 mb-2">Order Notes</h4>
              <p className="text-sm text-gray-600">{orderData.notes}</p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            What happens next?
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>We'll send you an email confirmation shortly</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>
                Your artwork will be carefully packaged within 1-2 business days
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>You'll receive tracking information once shipped</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              <span>Estimated delivery: 5-7 business days</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center"
          >
            View My Orders
          </Link>
          <Link
            to="/"
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8 pt-8 border-t">
          <p className="text-sm text-gray-600 mb-2">
            Questions about your order?
          </p>
          <div className="flex justify-center space-x-4 text-sm">
            <a
              href="mailto:support@artstore.com"
              className="text-blue-600 hover:text-blue-800"
            >
              Email Support
            </a>
            <span className="text-gray-400">|</span>
            <a
              href="tel:+1-555-123-4567"
              className="text-blue-600 hover:text-blue-800"
            >
              Call (555) 123-4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
