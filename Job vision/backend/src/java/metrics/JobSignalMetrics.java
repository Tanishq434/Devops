@Component
public class JobSignalMetrics {


private final Counter jobsDetected;
private final Counter jobsSkipped;
private final Counter schedulerFailures;
private final Timer schedulerTimer;


public JobSignalMetrics(MeterRegistry registry) {
this.jobsDetected = registry.counter("smart_job_signal_jobs_detected_total");
this.jobsSkipped = registry.counter("smart_job_signal_jobs_skipped_total");
this.schedulerFailures = registry.counter("smart_job_signal_scheduler_failures_total");
this.schedulerTimer = registry.timer("smart_job_signal_scheduler_duration_seconds");
}


public void incrementDetected(int count) {
jobsDetected.increment(count);
}


public void incrementSkipped() {
jobsSkipped.increment();
}


public Timer.Sample startTimer() {
return Timer.start();
}


public void stopTimer(Timer.Sample sample) {
sample.stop(schedulerTimer);
}


public void recordFailure() {
schedulerFailures.increment();
}
}