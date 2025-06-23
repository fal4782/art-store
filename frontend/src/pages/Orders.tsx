import { useMyOrders } from "../hooks";
import { useAuth } from "../hooks";
import { Navigate } from "react-router-dom";

export default function Orders() {
  const { user } = useAuth();
  const { orders, ordersLoading, error } = useMyOrders();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (ordersLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "CONFIRMED":
        return "bg-blue-100 text-blue-800";
      case "PROCESSING":
        return "bg-purple-100 text-purple-800";
      case "SHIPPED":
        return "bg-indigo-100 text-indigo-800";
      case "DELIVERED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-600">Track and manage your artwork purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders yet
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't made any purchases yet. Start browsing our collection!
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Browse Artworks
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md border overflow-hidden"
            >
              {/* Order Header */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="mb-2 sm:mb-0">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Order #{order.id.slice(-8)}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ${order.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                        {item.artwork.images &&
                        item.artwork.images.length > 0 ? (
                          <img
                            src={item.artwork.images[0]}
                            alt={item.artwork.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/64x64?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium text-gray-900">
                          {item.artwork.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {item.artwork.category} • Qty: {item.quantity}
                        </p>
                        {item.artwork.medium && (
                          <p className="text-xs text-gray-500">
                            {item.artwork.medium}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">
                          ${item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 px-6 py-4 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Shipping Address
                    </h5>
                    <div className="text-sm text-gray-600">
                      <p>{order.customerName}</p>
                      <p>{order.shippingAddress.street}</p>
                      <p>
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state}{" "}
                        {order.shippingAddress.zipCode}
                      </p>
                      <p>{order.shippingAddress.country}</p>
                    </div>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">
                      Contact Info
                    </h5>
                    <div className="text-sm text-gray-600">
                      <p>{order.customerEmail}</p>
                      {order.customerPhone && <p>{order.customerPhone}</p>}
                    </div>
                    {order.notes && (
                      <div className="mt-2">
                        <h6 className="font-medium text-gray-900 text-xs">
                          Notes:
                        </h6>
                        <p className="text-xs text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Actions */}
              <div className="px-6 py-4 border-t bg-white">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <div className="text-sm text-gray-600">
                    Last updated:{" "}
                    {new Date(order.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="flex space-x-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View Details
                    </button>
                    {order.status === "DELIVERED" && (
                      <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                        Leave Review
                      </button>
                    )}
                    {["PENDING", "CONFIRMED"].includes(order.status) && (
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
