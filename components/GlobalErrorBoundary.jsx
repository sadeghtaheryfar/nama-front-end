"use client";
import React from "react";
import axios from "axios";
import Cookies from "js-cookie";

export default class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.logError(error, errorInfo);
    }

    logError = async (error, errorInfo = null) => {
        try {
            const token = Cookies.get("token");
            const formdata = new FormData();
            formdata.append(
                "context",
                JSON.stringify({
                    message: error?.message || "Unknown Error",
                    stack: error?.stack,
                    componentStack: errorInfo?.componentStack,
                    source: "GlobalErrorBoundary",
                })
            );
            formdata.append("client_version", "1.0.0");
            formdata.append("platform", "web");

            await axios.post(
                "http://arman.armaniran.org/api/v1/client-log",
                formdata,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
        } catch (err) {
            console.error("Failed to send error log:", err);
        }
    };

    render() {
        if (this.state.hasError) {
            return null;
        }

        return this.props.children;
    }
}
