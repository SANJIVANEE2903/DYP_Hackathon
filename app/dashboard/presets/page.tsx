'use client';

import { useState } from 'react';
import { DashboardShell } from '@/components/layout/dashboard-shell';
import { PresetForm } from '@/components/presets/preset-form';
import { MOCK_PRESETS } from '@/lib/mock-data';
import { Preset, PresetSettings } from '@/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function PresetsPage() {
  const [presets, setPresets] = useState<Preset[]>(MOCK_PRESETS);
  const [showForm, setShowForm] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | undefined>(undefined);

  const handleSave = (data: { name: string; settings: PresetSettings }) => {
    if (editingPreset) {
      setPresets(prev => prev.map(p =>
        p.id === editingPreset.id ? { ...p, ...data, lastModified: 'just now' } : p
      ));
    } else {
      const newPreset: Preset = {
        id: String(Date.now()),
        appliedRepos: 0,
        lastModified: 'just now',
        ...data,
      };
      setPresets(prev => [...prev, newPreset]);
    }
    setShowForm(false);
    setEditingPreset(undefined);
  };

  const handleEdit = (preset: Preset) => {
    setEditingPreset(preset);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this preset?')) {
      setPresets(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPreset(undefined);
  };

  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#fafafa]">
        {/* Header */}
        <div className="bg-white border-b border-[#e5e7eb] px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0a0a0a]">Org Presets</h1>
            <p className="text-sm text-[#6b7280] mt-1">Define standards once, apply across all repositories</p>
          </div>
          <Button
            onClick={() => { setEditingPreset(undefined); setShowForm(true); }}
            className="inline-flex items-center gap-2"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New preset
          </Button>
        </div>

        <div className="p-8 space-y-4">
          {/* Presets list */}
          {presets.length === 0 && !showForm ? (
            <Card className="p-12 text-center bg-white border-dashed border-2">
              <div className="w-12 h-12 bg-[#f3f4f6] rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg width="20" height="20" fill="none" stroke="#9ca3af" strokeWidth="2" viewBox="0 0 24 24">
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="8" y1="12" x2="20" y2="12" />
                  <line x1="12" y1="18" x2="20" y2="18" />
                </svg>
              </div>
              <h3 className="font-semibold text-[#0a0a0a] mb-1">No presets yet</h3>
              <p className="text-sm text-[#6b7280] mb-6">Create your first org preset to standardize repository configurations.</p>
              <Button onClick={() => setShowForm(true)}>
                Create preset
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {presets.map(preset => (
                <Card key={preset.id} className="p-5 hover:border-[#d1d5db] transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-[#eff6ff] flex items-center justify-center shrink-0 border border-[#dbeafe]">
                        <svg width="18" height="18" fill="none" stroke="#0070f3" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="4" y1="6" x2="20" y2="6" />
                          <circle cx="4" cy="12" r="2" />
                          <line x1="8" y1="12" x2="20" y2="12" />
                          <circle cx="8" cy="18" r="2" />
                          <line x1="12" y1="18" x2="20" y2="18" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-[#0a0a0a] leading-tight">{preset.name}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="text-xs text-[#6b7280]">
                            Applied to {preset.appliedRepos} {preset.appliedRepos === 1 ? 'repo' : 'repos'}
                          </span>
                          <span className="text-[#e5e7eb] text-xs">·</span>
                          <span className="text-xs text-[#9ca3af]">Modified {preset.lastModified}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => handleEdit(preset)}
                        className="h-8 px-3 text-xs"
                      >
                        Edit
                      </Button>
                      <Button variant="secondary" className="h-8 px-3 text-xs">
                        Apply
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(preset.id)}
                        className="h-8 px-3 text-xs text-[#ef4444] hover:text-[#dc2626] hover:bg-[#fee2e2]"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* Stack tags */}
                  {preset.settings.stacks.length > 0 && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#f3f4f6]">
                      <span className="text-[10px] font-medium text-[#9ca3af] uppercase tracking-wider">Targets:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {preset.settings.stacks.map(s => (
                          <Badge key={s} variant="info" className="text-[10px] h-5 px-2 bg-[#f3f4f6] text-[#374151] border-none">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}

          {/* Form Modal/Overlay logic could go here, for now it's just appended */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0a0a0a]/20 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-1 px-[1px]">
                   <PresetForm
                    preset={editingPreset}
                    onSave={handleSave}
                    onCancel={handleCancel}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
