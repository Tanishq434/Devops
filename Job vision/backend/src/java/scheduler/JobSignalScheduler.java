@Component
public class JobSignalScheduler {


private static final Logger log = LoggerFactory.getLogger(JobSignalScheduler.class);


private final JobSignalMetrics metrics;


public JobSignalScheduler(JobSignalMetrics metrics) {
this.metrics = metrics;
}


@Scheduled(fixedDelay = 300000) // every 5 min
public void scanJobs() {
Timer.Sample sample = metrics.startTimer();


try {
log.info("Job signal scan started");


int detected = 3; // simulate
metrics.incrementDetected(detected);


log.info("Job signal scan completed, detected {} jobs", detected);
} catch (Exception ex) {
metrics.recordFailure();
log.error("Job signal scheduler failed", ex);
} finally {
metrics.stopTimer(sample);
}
}
}