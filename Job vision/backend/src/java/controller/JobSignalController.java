@RestController
@RequestMapping("/api/jobs")
public class JobSignalController {


private final JobSignalRepository repo;


@GetMapping
public List<JobSignalResponse> getSignals(Principal principal) {
return repo.findByUserEmail(principal.getName());
}
}