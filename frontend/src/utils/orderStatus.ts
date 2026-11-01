import {
  FiCheckCircle,
  FiClock,
  FiPackage,
  FiTruck,
  FiXCircle,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import { theme } from "../theme";
import type { OrderStatus } from "../types/order";

export interface StatusConfig {
  label: string;
  icon: IconType;
  color: string;
  bg: string;
}

const STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
  // PENDING means the customer hasn't paid yet, not that the order is being
  // worked on.
  PENDING: {
    label: "Awaiting Payment",
    icon: FiClock,
    color: theme.colors.warning,
    bg: `${theme.colors.warning}15`,
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: FiPackage,
    color: theme.colors.primary,
    bg: `${theme.colors.primary}15`,
  },
  SHIPPED: {
    label: "In Transit",
    icon: FiTruck,
    color: theme.colors.info,
    bg: `${theme.colors.info}15`,
  },
  DELIVERED: {
    label: "Delivered",
    icon: FiCheckCircle,
    color: theme.colors.secondary,
    bg: `${theme.colors.secondary}15`,
  },
  CANCELLED: {
    label: "Cancelled",
    icon: FiXCircle,
    color: theme.colors.error,
    bg: `${theme.colors.error}15`,
  },
};

export const getStatusConfig = (status: OrderStatus): StatusConfig =>
  STATUS_CONFIG[status] ?? {
    label: status,
    icon: FiPackage,
    color: theme.colors.primary,
    bg: `${theme.colors.primary}15`,
  };
