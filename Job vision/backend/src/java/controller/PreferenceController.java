@RestController
@RequestMapping("/api/preferences")
public class PreferenceController {


private final JobPreferenceRepository repo;


@PostMapping
public ResponseEntity<?> save(@RequestBody PreferenceRequest req, Principal principal) {
// principal gives logged-in user
// save preference
return ResponseEntity.ok().build();
}


@GetMapping
public ResponseEntity<?> get(Principal principal) {
return ResponseEntity.ok(repo.findByUserEmail(principal.getName()));
}
}