export interface CrashReporterOptions {
  endpoint?: string;
  projectKey: string;
  service?: string;
  environment?: string;
  language?: string;
  framework?: string;
  runtimeRegion?: string;
}

export interface CrashReportOverrides {
  service?: string;
  environment?: string;
  error_type?: string;
  message?: string;
  stack?: string;
  language?: string;
  framework?: string;
  runtime_region?: string;
}

export interface CrashReporter {
  report(error: unknown, overrides?: CrashReportOverrides): Promise<unknown>;
  installRuntimeHooks(): void;
  expressErrorMiddleware(): (error: Error, request: unknown, response: unknown, next: (error: Error) => void) => void;
}

export function createCrashReporter(options: CrashReporterOptions): CrashReporter;
export function reportCrash(
  options: CrashReporterOptions,
  error: unknown,
  overrides?: CrashReportOverrides
): Promise<unknown>;
