package com.bibimartins.dto;

import java.util.ArrayList;
import java.util.List;

public class EmployeeUploadResponse {

    private boolean success;
    private String message;
    private int totalProcessed;
    private int totalImported;
    private int totalErrors;
    private List<String> errorDetails = new ArrayList<>();
    private List<String> successDetails = new ArrayList<>();

    public EmployeeUploadResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public int getTotalProcessed() { return totalProcessed; }
    public void setTotalProcessed(int totalProcessed) { this.totalProcessed = totalProcessed; }

    public int getTotalImported() { return totalImported; }
    public void setTotalImported(int totalImported) { this.totalImported = totalImported; }

    public int getTotalErrors() { return totalErrors; }
    public void setTotalErrors(int totalErrors) { this.totalErrors = totalErrors; }

    public List<String> getErrorDetails() { return errorDetails; }
    public void setErrorDetails(List<String> errorDetails) { this.errorDetails = errorDetails; }

    public List<String> getSuccessDetails() { return successDetails; }
    public void setSuccessDetails(List<String> successDetails) { this.successDetails = successDetails; }
}
