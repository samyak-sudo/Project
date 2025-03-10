import reportWebVitals from "./reportWebVitals";

// Mock 'web-vitals' before it's dynamically imported
jest.mock("web-vitals", () => ({
  getCLS: jest.fn(),
  getFID: jest.fn(),
  getFCP: jest.fn(),
  getLCP: jest.fn(),
  getTTFB: jest.fn(),
}));

describe("reportWebVitals", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should NOT call web-vitals methods if onPerfEntry is not a function", async () => {
    reportWebVitals(null);
    reportWebVitals(undefined);
    reportWebVitals({});
    reportWebVitals("string");
    reportWebVitals(42);

    const { getCLS, getFID, getFCP, getLCP, getTTFB } = require("web-vitals");

    expect(getCLS).not.toHaveBeenCalled();
    expect(getFID).not.toHaveBeenCalled();
    expect(getFCP).not.toHaveBeenCalled();
    expect(getLCP).not.toHaveBeenCalled();
    expect(getTTFB).not.toHaveBeenCalled();
  });

  it("should call all web-vitals functions when onPerfEntry is a function", async () => {
    const mockPerfEntry = jest.fn();

    // Call reportWebVitals and wait for the import to resolve
    await reportWebVitals(mockPerfEntry);
    await new Promise((resolve) => setTimeout(resolve, 100)); // Ensure async import completes

    // Re-import mocked functions
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = require("web-vitals");

    // Ensure each function was called with mockPerfEntry
    expect(getCLS).toHaveBeenCalledTimes(1);
    expect(getCLS).toHaveBeenCalledWith(mockPerfEntry);
    
    expect(getFID).toHaveBeenCalledTimes(1);
    expect(getFID).toHaveBeenCalledWith(mockPerfEntry);
    
    expect(getFCP).toHaveBeenCalledTimes(1);
    expect(getFCP).toHaveBeenCalledWith(mockPerfEntry);
    
    expect(getLCP).toHaveBeenCalledTimes(1);
    expect(getLCP).toHaveBeenCalledWith(mockPerfEntry);
    
    expect(getTTFB).toHaveBeenCalledTimes(1);
    expect(getTTFB).toHaveBeenCalledWith(mockPerfEntry);
  });
});
