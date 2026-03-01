@RestControllerAdvice
public class GlobalExceptionHandler {


private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);


@ExceptionHandler(Exception.class)
public ResponseEntity<?> handleException(Exception ex) {
log.error("Unhandled exception", ex);
return ResponseEntity.status(500)
.body(Map.of("error", "Internal server error"));
}
}