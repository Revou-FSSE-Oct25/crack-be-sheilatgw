export const shippingConfig = {
  REGULAR: {
    JNE: [{ service: "REG", cost: 10000 }],
    SICEPAT: [{ service: "REG", cost: 9000 }],
  },
  NEXT_DAY: {
    JNE: [{ service: "YES", cost: 20000 }],
    SICEPAT: [{ service: "BEST", cost: 18000 }],
  },
  SAME_DAY: {
    GOJEK: [{ service: "INSTANT", cost: 30000 }],
    GRAB: [{ service: "INSTANT", cost: 32000 }],
  },
};