@RestController
@RequestMapping("/api/auth")
public class AuthController {


private final AuthService authService;


public AuthController(AuthService authService) {
this.authService = authService;
}


@PostMapping("/signup")
public ResponseEntity<?> signup(@RequestBody SignupRequest req) {
return ResponseEntity.ok(authService.signup(req));
}


@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody LoginRequest req) {
return ResponseEntity.ok(authService.login(req));
}
}