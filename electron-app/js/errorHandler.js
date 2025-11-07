// Centralized error handling for the application

/**
 * ErrorHandler provides centralized error handling and user notification
 * for both caught and uncaught errors in the Electron application.
 * 
 * Best practices implemented:
 * - User-facing error dialogs for production users
 * - Console logging for developer debugging
 * - Global handlers for uncaught exceptions and promise rejections
 */
class ErrorHandler {
    constructor() {
        this.isDev = false;
    }

    /**
     * Initialize global error handlers
     * This should be called once during application initialization
     */
    initialize(isDev = false) {
        this.isDev = isDev;

        // Handle uncaught errors in renderer process
        window.addEventListener('error', (event) => {
            console.error('Uncaught error:', event.error);
            this.showError('Unexpected Error', event.error);
            event.preventDefault(); // Prevent default browser error handling
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showError('Promise Rejection', event.reason);
            event.preventDefault(); // Prevent default browser handling
        });

        console.log('Error handler initialized', isDev ? '(development mode)' : '(production mode)');
    }

    /**
     * Show an error to the user with a dialog box
     * @param {string} context - Context or title for the error
     * @param {Error|string} error - The error object or message
     */
    showError(context, error) {
        const errorMessage = this.formatErrorMessage(error);
        const fullMessage = `${context}:\n\n${errorMessage}`;

        // Always log to console for debugging
        console.error(`[${context}]`, error);

        // Show user-facing dialog
        if (window.electronAPI && window.electronAPI.showErrorDialog) {
            // Use native Electron dialog (preferred)
            window.electronAPI.showErrorDialog(context, errorMessage);
        } else {
            // Fallback to browser alert
            alert(fullMessage);
        }
    }

    /**
     * Format an error for display to the user
     * @param {Error|string} error - The error to format
     * @returns {string} - Formatted error message
     */
    formatErrorMessage(error) {
        if (!error) {
            return 'An unknown error occurred';
        }

        if (typeof error === 'string') {
            return error;
        }

        if (error instanceof Error) {
            // In development, show stack trace for debugging
            if (this.isDev && error.stack) {
                return `${error.message}\n\nStack trace:\n${error.stack}`;
            }
            return error.message || error.toString();
        }

        // Handle other types of errors
        return String(error);
    }

    /**
     * Wrap a function with error handling
     * This is useful for event handlers and callbacks
     * @param {Function} fn - The function to wrap
     * @param {string} context - Context description for error messages
     * @returns {Function} - Wrapped function with error handling
     */
    wrap(fn, context) {
        return (...args) => {
            try {
                const result = fn(...args);
                
                // Handle async functions
                if (result && typeof result.catch === 'function') {
                    return result.catch(error => {
                        this.showError(context, error);
                        throw error; // Re-throw to allow caller to handle if needed
                    });
                }
                
                return result;
            } catch (error) {
                this.showError(context, error);
                throw error; // Re-throw to allow caller to handle if needed
            }
        };
    }

    /**
     * Wrap an async function with error handling
     * @param {Function} fn - The async function to wrap
     * @param {string} context - Context description for error messages
     * @returns {Function} - Wrapped async function with error handling
     */
    wrapAsync(fn, context) {
        return async (...args) => {
            try {
                return await fn(...args);
            } catch (error) {
                this.showError(context, error);
                throw error; // Re-throw to allow caller to handle if needed
            }
        };
    }

    /**
     * Handle an error in a try-catch block
     * Use this when you want to show the error but not re-throw
     * @param {string} context - Context description for error messages
     * @param {Error} error - The error to handle
     */
    handle(context, error) {
        this.showError(context, error);
    }
}

// Create singleton instance
window.errorHandler = new ErrorHandler();
