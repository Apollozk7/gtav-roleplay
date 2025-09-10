"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function SecuritySection() {
  const [decryptedManifesto, setDecryptedManifesto] = useState(false)
  const [decryptedProtocols, setDecryptedProtocols] = useState(false)

  const encryptedManifesto =
    "V2UgYXJlIG5vdCBOUENzLiBXZSByZWplY3QgdGhlIG1pbmRsZXNzIGNvbmZvcm1pdHkgb2YgdGhlIG1hc3Nlcy4gV2UgYXJlIGdob3N0cyBpbiB0aGUgbWFjaGluZSwgc2hhZG93cyBvbiB0aGUgYXNwaGFsdC4gT3VyIHZlaGljbGVzIGFyZSBleHRlbnNpb25zIG9mIG91ciBzb3VsLCBub3QgbWVyZSB0b29scy4gV2UgcmFjZSBub3QgZm9yIGZhbWUgb3IgZ2xvcnksIGJ1dCBmb3IgdGhlIHB1cmUgZXhoaWxhcmF0aW9uIG9mIHNwZWVkIGFuZCB0aGUgYnJvdGhlcmhvb2Qgb2YgdGhvc2Ugd2hvIHVuZGVyc3RhbmQuIFdlIGFyZSB0aGUgdW5kZXJncm91bmQuIFdlIGFyZSB0aGUgcmVzaXN0YW5jZS4gV2UgYXJlIE5PIE5QQy4="

  const encryptedProtocols =
    "MS4gTkVWRVIgcmV2ZWFsIHJlYWwgaWRlbnRpdGllcyBvciByZWFsLXdvcmxkIGluZm9ybWF0aW9uCjIuIEFsbCBjb21tdW5pY2F0aW9ucyBtdXN0IHVzZSBlbmNyeXB0ZWQgY2hhbm5lbHMKMy4gTFNTRCBzdXJ2ZWlsbGFuY2UgcHJvdG9jb2xzIGFyZSBhbHdheXMgYWN0aXZlCjQuIE9wZXJhdGlvbiBsb2NhdGlvbnMgYXJlIGRpc2Nsb3NlZCBvbmx5IDIgaG91cnMgYmVmb3JlIHN0YXJ0CjUuIEVtZXJnZW5jeSBleHRyYWN0aW9uIGNvZGU6IFJFRCBGT1ggLSBhbGwgdW5pdHMgZGlzcGVyc2UgaW1tZWRpYXRlbHkKNi4gTm8gTlBDIHZlaGljbGVzIGFsbG93ZWQgaW4gb3BlcmF0aW9ucwo3LiBCZXRyYXlhbCBvZiB0aGUgbmV0d29yayByZXN1bHRzIGluIHBlcm1hbmVudCBiYW4KOC4gQWxsIG1lbWJlcnMgbXVzdCBtYWludGFpbiBvcGVyYXRpb25hbCBzZWN1cml0eSBhdCBhbGwgdGltZXM="

  const decryptBase64 = (encoded: string) => {
    try {
      return atob(encoded)
    } catch {
      return "[DECRYPTION_ERROR]"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-primary">root@no-npc:~/security#</h2>
        <div className="text-sm text-muted-foreground">ENCRYPTION: AES-256 | CLEARANCE: LEVEL_3 | STATUS: SECURE</div>
      </div>

      <div className="bg-accent/10 border border-accent p-3 rounded text-sm">
        <div className="text-accent font-bold">[MAXIMUM SECURITY ZONE]</div>
        <div className="text-accent-foreground">
          • All data in this section is encrypted and monitored
          <br />• Unauthorized access attempts are logged and traced
          <br />• Security breaches result in immediate network termination
        </div>
      </div>

      {/* Security Protocols */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-primary flex items-center gap-2">
            [CLASSIFIED] SECURITY PROTOCOLS
            <span className="text-accent text-sm">[LEVEL_3_CLEARANCE_REQUIRED]</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/20 p-4 rounded font-mono text-sm">
            {decryptedProtocols ? (
              <div className="whitespace-pre-line text-foreground">{decryptBase64(encryptedProtocols)}</div>
            ) : (
              <div className="text-muted-foreground break-all">{encryptedProtocols}</div>
            )}
          </div>
          <Button
            onClick={() => setDecryptedProtocols(!decryptedProtocols)}
            variant={decryptedProtocols ? "destructive" : "default"}
            className="font-mono"
          >
            {decryptedProtocols ? "[ENCRYPT_DATA]" : "[DECRYPT_PROTOCOLS]"}
          </Button>
        </CardContent>
      </Card>

      {/* Network Manifesto */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-primary flex items-center gap-2">
            [CLASSIFIED] NO NPC MANIFESTO
            <span className="text-accent text-sm">[FOUNDING_DOCUMENT]</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/20 p-4 rounded font-mono text-sm">
            {decryptedManifesto ? (
              <div className="whitespace-pre-line text-foreground">{decryptBase64(encryptedManifesto)}</div>
            ) : (
              <div className="text-muted-foreground break-all">{encryptedManifesto}</div>
            )}
          </div>
          <Button
            onClick={() => setDecryptedManifesto(!decryptedManifesto)}
            variant={decryptedManifesto ? "destructive" : "default"}
            className="font-mono"
          >
            {decryptedManifesto ? "[ENCRYPT_DATA]" : "[DECRYPT_MANIFESTO]"}
          </Button>
        </CardContent>
      </Card>

      {/* Security Measures */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-primary">ACTIVE SECURITY MEASURES</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between bg-muted/20 p-3 rounded">
              <div className="font-mono text-sm">
                <div className="text-foreground font-semibold">FIREWALL STATUS</div>
                <div className="text-muted-foreground">Advanced intrusion detection active</div>
              </div>
              <div className="text-primary font-mono text-sm">ACTIVE</div>
            </div>

            <div className="flex items-center justify-between bg-muted/20 p-3 rounded">
              <div className="font-mono text-sm">
                <div className="text-foreground font-semibold">TRACE PROTECTION</div>
                <div className="text-muted-foreground">Multi-layer proxy routing enabled</div>
              </div>
              <div className="text-primary font-mono text-sm">ENABLED</div>
            </div>

            <div className="flex items-center justify-between bg-muted/20 p-3 rounded">
              <div className="font-mono text-sm">
                <div className="text-foreground font-semibold">COMMUNICATION ENCRYPTION</div>
                <div className="text-muted-foreground">End-to-end AES-256 encryption</div>
              </div>
              <div className="text-primary font-mono text-sm">SECURE</div>
            </div>

            <div className="flex items-center justify-between bg-muted/20 p-3 rounded">
              <div className="font-mono text-sm">
                <div className="text-foreground font-semibold">LSSD COUNTERMEASURES</div>
                <div className="text-muted-foreground">Real-time surveillance detection</div>
              </div>
              <div className="text-accent font-mono text-sm">MONITORING</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Protocols */}
      <Card className="bg-accent/5 border-accent border">
        <CardHeader>
          <CardTitle className="text-lg font-mono text-accent">EMERGENCY PROTOCOLS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm">
            <div className="font-mono">
              <span className="text-accent font-bold">CODE RED:</span>
              <span className="text-accent-foreground ml-2">Immediate network shutdown and dispersal</span>
            </div>
            <div className="font-mono">
              <span className="text-accent font-bold">CODE YELLOW:</span>
              <span className="text-accent-foreground ml-2">Elevated security, operations suspended</span>
            </div>
            <div className="font-mono">
              <span className="text-accent font-bold">CODE GREEN:</span>
              <span className="text-accent-foreground ml-2">All clear, normal operations</span>
            </div>
          </div>
          <div className="bg-accent/10 p-3 rounded text-xs text-accent">
            Current Status: CODE GREEN - Normal operations authorized
          </div>
        </CardContent>
      </Card>

      <div className="border-t border-border pt-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>[REMINDER] Security is everyone&apos;s responsibility</div>
          <div>[WARNING] This section is monitored by automated security systems</div>
          <div>[NOTICE] Report any suspicious activity to network administrators immediately</div>
        </div>
      </div>
    </div>
  )
}
